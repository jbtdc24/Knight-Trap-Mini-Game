export default function HomeScreen({ onPlayClick }: { onPlayClick: () => void }) {
  return (
    <div 
      className="relative flex h-screen w-screen flex-col items-center justify-center bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/home-background.png')", backgroundSize: 'auto 100%' }}
    >
      <div className="flex flex-col items-center gap-8">
        <img src="/Logo 8bit.png" alt="Logo" className="w-64 sm:w-80 md:w-96" />
        <img 
          src="/Playbutton.png" 
          alt="Play" 
          className="cursor-pointer h-16 sm:h-20 md:h-24"
          onClick={onPlayClick} 
        />
      </div>
    </div>
  );
}
