const { useState, useEffect, useRef, useCallback } = React;

// --- Game Constants ---
const BOARD_SIZE = 6;
const TILE_SIZE = 60; 
const CANVAS_WIDTH = BOARD_SIZE * TILE_SIZE; 
const CANVAS_HEIGHT = BOARD_SIZE * TILE_SIZE; 

const INITIAL_VOID_DEPTH = 3;
const MAX_VOID_DEPTH = 20;

const POINTS_PER_MOVE = 10;
const POINTS_PER_CAPTURE = 50;
const MULTIPLIER_THRESHOLD = 20; 

const BOARD_OFFSET_X = 0; 
const BOARD_OFFSET_Y = 0; 
const ANIMATION_DURATION = 0.2; 
const BLACK_MOVE_DELAY = 0.05; 
const JUMP_HEIGHT = 30; 

const DARK_TILE_COLOR = 0x6B7280;
const LIGHT_TILE_COLOR = 0xFFFFFF;
const HIGHLIGHT_COLOR = 0x10B981; 

const FONT_FAMILY = 'Bebas Neue, sans-serif'; 

/**
 * Utility function to convert [col, row] to a string key "c_r"
 */
const posToKey = (pos) => `${pos[0]}_${pos[1]}`;
const keyToPos = (key) => key.split('_').map(Number);

/**
 * Calculates all 8 potential Knight moves.
 */
const getPotentialKnightMoves = ([c, r]) => {
    const moves = [
        [c + 2, r + 1], [c + 2, r - 1], [c - 2, r + 1], [c - 2, r - 1],
        [c + 1, r + 2], [c + 1, r - 2], [c - 1, r + 2], [c - 1, r - 2]
    ];
    return moves.filter(([nc, nr]) => nc >= 0 && nc < 6 && nr >= 0 && nr < 6);
};


const App = () => {
    const pixiContainerRef = useRef(null);
    const appRef = useRef(null);
    const staticGraphicsRef = useRef(null); 
    const dynamicGraphicsRef = useRef(null); 

    const whiteKnightRef = useRef(null);
    const bk1Ref = useRef(null);
    const bk2Ref = useRef(null);

    const [score, setScore] = useState(0);
    const [captureCount, setCaptureCount] = useState(0);
    const [moveCount, setMoveCount] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [isGameOver, setIsGameOver] = useState(true);
    const [playerPos, setPlayerPos] = useState([2, 3]); 
    const [blackKnightPositions, setBlackKnightPositions] = useState([[0, 0], [5, 4]]); 
    const [voidHistory, setVoidHistory] = useState([]); 
    const [voidDepth, setVoidDepth] = useState(INITIAL_VOID_DEPTH);
    const [isAnimating, setIsAnimating] = useState(false); 

    const targetX = c => BOARD_OFFSET_X + c * TILE_SIZE + TILE_SIZE / 2;
    const targetY = r => BOARD_OFFSET_Y + r * TILE_SIZE + TILE_SIZE / 2;

    // Memoized initial state for reset
    const getInitialState = useCallback(() => ({
        score: 0, captureCount: 0, moveCount: 0, multiplier: 1, isGameOver: false,
        playerPos: [2, 3], blackKnightPositions: [[0, 0], [5, 4]], 
        voidHistory: [], voidDepth: INITIAL_VOID_DEPTH,
    }), []);

    const findSafeRespawnPosition = useCallback((currentVoidHistory, allKnightPositions) => {
        const occupiedKeys = new Set(allKnightPositions.map(posToKey));
        const safeCandidates = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            for (let r = 0; r < BOARD_SIZE; r++) {
                const pos = [c, r];
                const key = posToKey(pos);
                if (!currentVoidHistory.includes(key) && !occupiedKeys.has(key)) {
                    safeCandidates.push(pos);
                }
            }
        }
        if (safeCandidates.length === 0) return null;
        return safeCandidates[Math.floor(Math.random() * safeCandidates.length)];
    }, []);

    const getSafeWhiteMoves = useCallback((pos, currentVoidHistory) => {
        const potentialMoves = getPotentialKnightMoves(pos);
        return potentialMoves.filter(move => !currentVoidHistory.includes(posToKey(move)));
    }, []);

    const findBestBlackKnightMove = useCallback((blackPos, otherBlackPos, whitePos, currentVoidHistory) => {
        const potentialMoves = getPotentialKnightMoves(blackPos);
        let bestMove = blackPos;
        let minSafeWhiteMoves = Infinity;
        const illegalKeys = new Set([...currentVoidHistory, posToKey(whitePos), posToKey(otherBlackPos)]);
        const legalBlackMoves = potentialMoves.filter(move => !illegalKeys.has(posToKey(move)));
        if (legalBlackMoves.length === 0) return blackPos;

        for (const move of legalBlackMoves) {
            const tempBlackPositions = [move, otherBlackPos];
            const safeWhiteMoves = getSafeWhiteMoves(whitePos, currentVoidHistory);
            const numSafeMoves = safeWhiteMoves.filter(wm => !tempBlackPositions.some(bp => posToKey(bp) === posToKey(wm))).length;

            if (numSafeMoves < minSafeWhiteMoves) {
                minSafeWhiteMoves = numSafeMoves;
                bestMove = move;
            } else if (numSafeMoves === minSafeWhiteMoves) {
                const dist1 = Math.abs(blackPos[0] - otherBlackPos[0]) + Math.abs(blackPos[1] - otherBlackPos[1]);
                const dist2 = Math.abs(move[0] - otherBlackPos[0]) + Math.abs(move[1] - otherBlackPos[1]);
                if (dist2 > dist1) {
                    bestMove = move;
                }
            }
        }
        return bestMove;
    }, [getSafeWhiteMoves]);

    const handlePlayerMove = useCallback((newPosKey) => {
        if (typeof window.gsap === 'undefined' || isGameOver || isAnimating) return;
        
        setIsAnimating(true); 
        dynamicGraphicsRef.current.eventMode = 'none'; // Lock input

        const oldPlayerPos = playerPos;
        const newPos = keyToPos(newPosKey);
        const newPosKeyString = posToKey(newPos);
        const whiteOldPosKey = posToKey(oldPlayerPos);
        
        if (voidHistory.includes(newPosKeyString)) { setIsGameOver(true); setIsAnimating(false); return; }

        const bkOldPositions = [...blackKnightPositions]; 
        let nextBlackPos = [...blackKnightPositions];
        let newScore = score;
        let newCaptureCount = captureCount;
        let basePoints = POINTS_PER_MOVE;
        let isCaptured = false;
        let capturedIndex = -1;
        
        capturedIndex = nextBlackPos.findIndex(bp => posToKey(bp) === newPosKeyString);

        if (capturedIndex !== -1) {
            basePoints = POINTS_PER_CAPTURE; newCaptureCount++; isCaptured = true;
            const allKnightPositions = [...nextBlackPos.filter((_, i) => i !== capturedIndex), newPos];
            const respawnPos = findSafeRespawnPosition(voidHistory, allKnightPositions);
            
            if (respawnPos) {
                nextBlackPos[capturedIndex] = respawnPos;
            } else {
                setIsGameOver(true); setIsAnimating(false); return;
            }
        }
        
        newScore = newScore + basePoints * multiplier;
        const nextMoveCount = moveCount + 1;

        const [bk1_initial, bk2_initial] = nextBlackPos;
        const bk1_new = findBestBlackKnightMove(bk1_initial, bk2_initial, newPos, voidHistory);
        const bk2_new = findBestBlackKnightMove(bk2_initial, bk1_new, newPos, voidHistory);
        const finalBlackPositions = [bk1_new, bk2_new];


        // --- GSAP ANIMATION TIMELINE ---
        
        const timeline = window.gsap.timeline({
            onStart: () => {
                // Clear dynamic graphics at start of animation to prevent flicker of OLD highlights
                if (dynamicGraphicsRef.current) dynamicGraphicsRef.current.clear(); 

                if (isCaptured) {
                    const capturedPieceRef = capturedIndex === 0 ? bk1Ref.current : bk2Ref.current;
                    if (capturedPieceRef) capturedPieceRef.visible = false;
                }
            },
            onComplete: () => {
                // DEFER STATE UPDATES
                setScore(newScore);
                setCaptureCount(newCaptureCount);
                setMoveCount(nextMoveCount);
                setPlayerPos(newPos);
                setBlackKnightPositions(finalBlackPositions);
                setIsAnimating(false); // Unlock input

                if (nextMoveCount > 0 && nextMoveCount % MULTIPLIER_THRESHOLD === 0) setMultiplier(prev => prev + 1);
                if (newCaptureCount > 0 && newCaptureCount % 5 === 0 && newCaptureCount === captureCount + 1) setVoidDepth(prevDepth => Math.min(MAX_VOID_DEPTH, prevDepth + 1));

                const allOldKeys = [whiteOldPosKey, posToKey(bkOldPositions[0]), posToKey(bkOldPositions[1])];
                setVoidHistory(prevVoidHistory => [...allOldKeys, ...prevVoidHistory].slice(0, voidDepth));
                
                // TRAP LOSS CHECK
                if (nextMoveCount > 1) { 
                    const whiteSafeMoves = getSafeWhiteMoves(newPos, voidHistory);
                    const remainingSafeMoves = whiteSafeMoves.filter(wm => 
                        !finalBlackPositions.some(bp => posToKey(bp) === posToKey(wm))
                    );
                    if (remainingSafeMoves.length === 0) setIsGameOver(true);
                }
            }
        });

        const knightSlideJump = (pieceRef, targetC, targetR, startTime) => {
            const targetXCoord = targetX(targetC);
            const targetYCoord = targetY(targetR);
            const currentY = pieceRef.current.y;
            
            timeline.to(pieceRef.current, {
                y: currentY - JUMP_HEIGHT,
                duration: ANIMATION_DURATION / 2,
                ease: "power2.out"
            }, startTime);
            
            timeline.to(pieceRef.current, {
                x: targetXCoord,
                y: targetYCoord, 
                duration: ANIMATION_DURATION / 2, 
                ease: "back.out(1.7)"
            }, `>`);
        };

        // SEQUENCE 1: WHITE KNIGHT SLIDE JUMP
        knightSlideJump(whiteKnightRef, newPos[0], newPos[1], 0);

        // SEQUENCE 2: BLACK KNIGHTS SLIDE JUMP
        const blackMoveStartTime = ANIMATION_DURATION + BLACK_MOVE_DELAY;

        knightSlideJump(bk1Ref, finalBlackPositions[0][0], finalBlackPositions[0][1], blackMoveStartTime);

        // Animate BK2 / Respawn
        if (isCaptured && capturedIndex === 1) {
            const respawnPos = finalBlackPositions[1];
            timeline.set(bk2Ref.current, {
                x: targetX(respawnPos[0]), y: targetY(respawnPos[1]), alpha: 0, visible: true,
            }, blackMoveStartTime);
            
            timeline.to(bk2Ref.current, { alpha: 1, duration: ANIMATION_DURATION * 0.5, ease: "power1.out"}, blackMoveStartTime);
        } else {
            knightSlideJump(bk2Ref, finalBlackPositions[1][0], finalBlackPositions[1][1], blackMoveStartTime);
        }

    }, [isGameOver, isAnimating, score, captureCount, voidHistory, voidDepth, blackKnightPositions, findSafeRespawnPosition, findBestBlackKnightMove, getSafeWhiteMoves, multiplier, moveCount, playerPos]);


    // --- PIXI Rendering Functions ---
    
    // Static Board Draw (Runs once)
    const drawStaticBoard = useCallback(() => {
        if (!staticGraphicsRef.current || !window.PIXI) return;
        const graphics = staticGraphicsRef.current;
        graphics.clear();
        for (let c = 0; c < BOARD_SIZE; c++) {
            for (let r = 0; r < BOARD_SIZE; r++) {
                const x = BOARD_OFFSET_X + c * TILE_SIZE;
                const y = BOARD_OFFSET_Y + r * TILE_SIZE;
                const isDark = (c + r) % 2 === 1;
                graphics.beginFill(isDark ? DARK_TILE_COLOR : LIGHT_TILE_COLOR);
                graphics.drawRect(x, y, TILE_SIZE, TILE_SIZE);
                graphics.endFill();
            }
        }
    }, []);

    // Dynamic Elements Draw (Runs on React state change)
    const drawDynamicElements = useCallback(() => {
        if (!dynamicGraphicsRef.current || !appRef.current || !window.PIXI) return;
        const PIXI = window.PIXI;
        
        const graphics = dynamicGraphicsRef.current;
        graphics.clear(); 
        
        // 1. Draw Void Tiles
        const voidTiles = new Set(voidHistory);
        for (let c = 0; c < BOARD_SIZE; c++) {
            for (let r = 0; r < BOARD_SIZE; r++) {
                const x = BOARD_OFFSET_X + c * TILE_SIZE;
                const y = BOARD_OFFSET_Y + r * TILE_SIZE;
                const key = posToKey([c, r]);

                if (voidTiles.has(key)) {
                    graphics.beginFill(0xEF4444, 0.5); 
                    graphics.drawRect(x, y, TILE_SIZE, TILE_SIZE);
                    graphics.endFill();
                }
            }
        }
        
        // 2. Determine Legal Player Moves and Highlight
        const safeWhiteMoves = getSafeWhiteMoves(playerPos, voidHistory);
        const legalMoves = safeWhiteMoves.filter(wm => 
            !blackKnightPositions.some(bp => posToKey(bp) === posToKey(wm))
        ).map(posToKey);
        
        if (!isGameOver) {
            legalMoves.forEach(key => {
                const [c, r] = keyToPos(key);
                const x = BOARD_OFFSET_X + c * TILE_SIZE;
                const y = BOARD_OFFSET_Y + r * TILE_SIZE;

                graphics.beginFill(HIGHLIGHT_COLOR, 0.25); 
                graphics.drawRect(x, y, TILE_SIZE, TILE_SIZE);
                graphics.endFill();
            });
        }

        // 3. Setup Click Handlers
        const legalMovesSet = new Set(legalMoves);
        const isInputAllowed = !isGameOver && !isAnimating;

        graphics.hitArea = new PIXI.Rectangle(BOARD_OFFSET_X, BOARD_OFFSET_Y, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        graphics.off('pointerdown'); 

        if (isInputAllowed) {
            graphics.eventMode = 'static';
            graphics.on('pointerdown', (event) => {
                const point = event.data.getLocalPosition(graphics);
                const col = Math.floor((point.x - BOARD_OFFSET_X) / TILE_SIZE);
                const row = Math.floor((point.y - BOARD_OFFSET_Y) / TILE_SIZE);
                const clickKey = posToKey([col, row]);

                if (legalMovesSet.has(clickKey)) {
                    handlePlayerMove(clickKey);
                }
            });
        } else {
            graphics.eventMode = 'none';
        }
    }, [isGameOver, isAnimating, playerPos, blackKnightPositions, voidHistory, getSafeWhiteMoves, handlePlayerMove]);

    // Draw Pieces (Called once, position updated via GSAP)
    const createPieces = useCallback(() => {
        if (!appRef.current || !window.PIXI || typeof window.gsap === 'undefined') return;
        
        if (whiteKnightRef.current) {
            // Remove existing piece objects from the stage
            appRef.current.stage.removeChild(whiteKnightRef.current, bk1Ref.current, bk2Ref.current);
        }
        
        const PIXI = window.PIXI;
        const PIECE_FONT_SIZE = TILE_SIZE * 0.7; 
        const WHITE_PIECE_STYLE = new PIXI.TextStyle({ 
            fontFamily: 'Arial', fontSize: PIECE_FONT_SIZE, fill: 0xFFFFFF, stroke: 0x000000, strokeThickness: 3 
        });
        const BLACK_PIECE_STYLE = new PIXI.TextStyle({ 
            fontFamily: 'Arial', fontSize: PIECE_FONT_SIZE, fill: 0x000000, stroke: 0xFFFFFF, strokeThickness: 3 
        });

        const initializePiece = (pos, symbol, style, ref) => {
            const pieceText = new PIXI.Text(symbol, style);
            pieceText.anchor.set(0.5);
            pieceText.x = targetX(pos[0]);
            pieceText.y = targetY(pos[1]);
            pieceText.visible = true;
            ref.current = pieceText;
            appRef.current.stage.addChild(pieceText);
        };
        
        // Ensure static and dynamic graphics are layered correctly
        if (!appRef.current.stage.children.includes(staticGraphicsRef.current)) appRef.current.stage.addChildAt(staticGraphicsRef.current, 0);
        if (!appRef.current.stage.children.includes(dynamicGraphicsRef.current)) appRef.current.stage.addChildAt(dynamicGraphicsRef.current, 1);

        // Re-initialize pieces and add them as top layers
        initializePiece(playerPos, '♘', WHITE_PIECE_STYLE, whiteKnightRef); 
        initializePiece(blackKnightPositions[0], '♞', BLACK_PIECE_STYLE, bk1Ref);
        initializePiece(blackKnightPositions[1], '♞', BLACK_PIECE_STYLE, bk2Ref);

    }, [playerPos, blackKnightPositions]);


    // --- Initialization Effect ---
    useEffect(() => {
        if (!pixiContainerRef.current) return;
        
        let pixiScript = null;
        let gsapScript = null;
        let isPixiLoaded = window.PIXI ? true : false;
        let isGsapLoaded = window.gsap ? true : false;

        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);


        const initializePixiApp = () => {
            if (appRef.current) { appRef.current.destroy(true); }
            const PIXI = window.PIXI;
            
            PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL;
            PIXI.settings.ROUND_PIXELS = true;

            const appInstance = new PIXI.Application({
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                backgroundColor: DARK_TILE_COLOR,
                antialias: true,
                powerPreference: 'high-performance', 
            });

            if (appInstance.view instanceof HTMLElement) {
                 appInstance.view.style.margin = 'auto';
                 appInstance.view.style.display = 'block';
            }

            pixiContainerRef.current.appendChild(appInstance.view);
            appRef.current = appInstance;
            
            // Initialize PIXI Graphics containers
            staticGraphicsRef.current = new PIXI.Graphics();
            dynamicGraphicsRef.current = new PIXI.Graphics();
            
            // Add layers in correct order
            appInstance.stage.addChild(staticGraphicsRef.current);
            appInstance.stage.addChild(dynamicGraphicsRef.current);

            drawStaticBoard();
            createPieces();
        };
        
        const attemptInitialization = () => {
            if (isPixiLoaded && isGsapLoaded) {
                initializePixiApp();
            }
        };

        const onPixiLoad = () => { isPixiLoaded = true; attemptInitialization(); };
        const onGsapLoad = () => { isGsapLoaded = true; attemptInitialization(); };

        if (!isPixiLoaded) {
            pixiScript = document.createElement('script');
            pixiScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.3.2/pixi.min.js";
            pixiScript.onload = onPixiLoad;
            document.body.appendChild(pixiScript);
        }

        if (!isGsapLoaded) {
            gsapScript = document.createElement('script');
            gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
            gsapScript.onload = onGsapLoad;
            document.body.appendChild(gsapScript);
        }
        
        if (isPixiLoaded && isGsapLoaded) { attemptInitialization(); }


        return () => {
            if (appRef.current) { 
                if (window.gsap) window.gsap.killTweensOf([whiteKnightRef.current, bk1Ref.current, bk2Ref.current]); 
                appRef.current.destroy(true); 
                appRef.current = null; 
            }
            if (pixiScript && document.body.contains(pixiScript)) { document.body.removeChild(pixiScript); }
            if (gsapScript && document.body.contains(gsapScript)) { document.body.removeChild(gsapScript); }
            if (fontLink && document.head.contains(fontLink)) { document.head.removeChild(fontLink); }
        };
    }, [drawStaticBoard, createPieces]);
    
    // --- State to Pixi Render Effect (Triggers static redraws) ---
    useEffect(() => {
        // This effect runs whenever game state changes to update the Voids/Highlights/Input
        drawDynamicElements();
    }, [isGameOver, isAnimating, voidHistory, playerPos, blackKnightPositions, voidDepth, drawDynamicElements, multiplier]);


    // --- Handler for Resetting the Game ---
    const handleStartGame = () => {
        const initialState = getInitialState();
        setScore(initialState.score);
        setCaptureCount(initialState.captureCount);
        setMoveCount(initialState.moveCount);
        setMultiplier(initialState.multiplier);
        setPlayerPos(initialState.playerPos);
        setBlackKnightPositions(initialState.blackKnightPositions);
        setVoidHistory(initialState.voidHistory);
        setVoidDepth(initialState.voidDepth);
        setIsGameOver(false);
        setIsAnimating(false); 
        createPieces(); // Reset piece visuals
    };

    // Calculate Multiplier Bar Progress
    const multiplierProgress = (moveCount % MULTIPLIER_THRESHOLD) * 100 / MULTIPLIER_THRESHOLD;

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-4 pt-4">
            
            {/* --- FIXED/SEPARATE HEADER --- */}
            <div className="w-full max-w-sm mb-6 px-4 font-['Bebas_Neue']">
                <h1 className="text-3xl font-extrabold text-yellow-400 text-center mb-4">KNIGHT TRAP</h1>
                
                {/* Scoreboard and Void Depth */}
                <div className="flex justify-between text-white font-mono text-sm mb-4 uppercase">
                    <span className="p-1 bg-gray-700 rounded text-lg flex-1 text-center mr-2">SCORE: {score}</span>
                    <span className="p-1 bg-gray-700 rounded text-lg flex-1 text-center ml-2">VOID DEPTH: {voidDepth}</span>
                </div>
                
                {/* Multiplier Bar */}
                <div className="mb-4 p-2 bg-gray-800 rounded-lg shadow-inner">
                    <div className="flex justify-between text-xs text-gray-300 font-bold mb-1 uppercase">
                        <span className="text-yellow-400 text-base">x{multiplier} MULTIPLIER</span>
                        <span>NEXT IN {MULTIPLIER_THRESHOLD - (moveCount % MULTIPLIER_THRESHOLD)} MOVES</span>
                    </div>
                    <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-yellow-400 transition-all duration-300 ease-in-out" 
                            style={{ width: `${multiplierProgress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            
            {/* --- GAME CARD (Board & Controls) --- */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm mx-auto"> 
                
                {/* PIXI Canvas Container */}
                <div className="w-full flex justify-center">
                    <div 
                        ref={pixiContainerRef} 
                        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }} 
                        className="border-4 border-gray-700 rounded shadow-inner"
                    />
                </div>
                
                {/* Control Panel */}
                <div className="mt-6 w-full flex justify-center flex-col items-center">
                    {isGameOver && score > 0 && (
                        <div className="text-xl font-bold text-red-500 mb-4 font-['Bebas_Neue'] uppercase">
                            GAME OVER! Final Score: {score}
                        </div>
                    )}
                    {isGameOver ? (
                        <button
                            onClick={handleStartGame}
                            className="bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-8 rounded-xl shadow-lg transition duration-150 transform hover:scale-105 active:scale-95 border-b-4 border-green-800 font-['Bebas_Neue'] uppercase"
                        >
                            {score > 0 ? 'PLAY AGAIN' : 'START GAME'}
                        </button>
                    ) : (
                        <div className="text-sm text-gray-400 text-center font-['Bebas_Neue'] uppercase">
                            Move: +{POINTS_PER_MOVE}pts (x{multiplier}). Capture: +{POINTS_PER_CAPTURE}pts (x{multiplier}).
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

window.App = App;
