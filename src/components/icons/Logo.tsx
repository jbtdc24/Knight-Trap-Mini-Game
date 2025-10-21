export const Logo = () => (
    <div className="text-center font-headline text-primary-foreground select-none">
        <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">
                KNIGHT TRAP
            </h1>
            <div className="absolute -top-1 -left-1 w-[calc(100%+0.5rem)] h-[calc(100%+0.5rem)] border-2 border-primary rounded-md transform -rotate-2"></div>
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                 <span className="text-primary text-6xl sm:text-7xl font-black opacity-30 transform scale-150">X</span>
            </div>
        </div>
        <h2 className="text-lg sm:text-xl tracking-widest text-primary-foreground/80 mt-2">
            THE ASCENSION
        </h2>
    </div>
);
