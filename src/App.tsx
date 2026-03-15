/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Settings, RotateCcw, Dices, Droplet, Zap, GraduationCap, ShieldAlert, Palette, X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PlayerColor = 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless';

interface Player {
  id: string;
  name: string;
  life: number;
  poison: number;
  energy: number;
  experience: number;
  commanderDamage: Record<string, number>;
  color: PlayerColor;
}

const COLOR_MAP: Record<PlayerColor, string> = {
  white: 'bg-stone-200 text-stone-900',
  blue: 'bg-blue-600 text-white',
  black: 'bg-zinc-900 text-white',
  red: 'bg-red-600 text-white',
  green: 'bg-emerald-600 text-white',
  colorless: 'bg-stone-500 text-white',
};

const INITIAL_LIFE = 20;

const createInitialPlayer = (id: string, name: string, color: PlayerColor, life: number): Player => ({
  id,
  name,
  life,
  poison: 0,
  energy: 0,
  experience: 0,
  commanderDamage: {},
  color,
});

export default function App() {
  const [startingLife, setStartingLife] = useState(() => {
    try {
      const saved = localStorage.getItem('mtg-starting-life');
      return saved ? JSON.parse(saved) : INITIAL_LIFE;
    } catch {
      return INITIAL_LIFE;
    }
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('mtg-players');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse players from local storage', e);
    }
    
    // Fallback to initial state
    const initialLife = (() => {
      try {
        const savedLife = localStorage.getItem('mtg-starting-life');
        return savedLife ? JSON.parse(savedLife) : INITIAL_LIFE;
      } catch {
        return INITIAL_LIFE;
      }
    })();
    
    return [
      createInitialPlayer('p1', 'Player 1', 'blue', initialLife),
      createInitialPlayer('p2', 'Player 2', 'red', initialLife),
    ];
  });

  useEffect(() => {
    localStorage.setItem('mtg-starting-life', JSON.stringify(startingLife));
  }, [startingLife]);

  useEffect(() => {
    localStorage.setItem('mtg-players', JSON.stringify(players));
  }, [players]);

  const [showSettings, setShowSettings] = useState(false);
  const [diceResult, setDiceResult] = useState<string | null>(null);

  const resetGame = (newLife?: number) => {
    const lifeToSet = newLife ?? startingLife;
    setPlayers(players.map(p => createInitialPlayer(p.id, p.name, p.color, lifeToSet)));
    setDiceResult(null);
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(players.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setDiceResult(`d${sides}: ${result}`);
  };

  const flipCoin = () => {
    const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
    setDiceResult(`Coin: ${result}`);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-white overflow-hidden font-sans select-none">
      {/* Player 2 (Top, Rotated) */}
      <PlayerArea 
        player={players[1]} 
        opponent={players[0]}
        updatePlayer={updatePlayer} 
        rotate={true} 
      />

      {/* Middle Bar */}
      <div className="h-48 bg-zinc-950 flex items-center justify-center gap-12 z-30 shadow-2xl border-y border-zinc-800 relative touch-none select-none">
        <button onPointerDown={() => resetGame()} className="p-4 text-zinc-400 hover:text-white transition-colors">
          <RotateCcw size={84} />
        </button>
        
        <div className="flex items-center gap-8">
          <button onPointerDown={() => rollDice(20)} className="p-4 text-zinc-400 hover:text-white transition-colors flex items-center gap-4 text-5xl font-bold">
            <Dices size={84} /> d20
          </button>
          <button onPointerDown={() => flipCoin()} className="p-4 text-zinc-400 hover:text-white transition-colors flex items-center gap-4 text-5xl font-bold">
            Coin
          </button>
        </div>

        <button onPointerDown={() => setShowSettings(true)} className="p-4 text-zinc-400 hover:text-white transition-colors">
          <Settings size={84} />
        </button>
      </div>

      {/* Player 1 (Bottom) */}
      <PlayerArea 
        player={players[0]} 
        opponent={players[1]}
        updatePlayer={updatePlayer} 
        rotate={false} 
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-white">
                  <X size={36} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium text-zinc-400 mb-4">Starting Life</h3>
                  <div className="flex gap-3">
                    {[20, 30, 40].map(life => (
                      <button
                        key={life}
                        onClick={() => {
                          setStartingLife(life);
                          resetGame(life);
                          setShowSettings(false);
                        }}
                        className={`flex-1 py-4 text-2xl rounded-lg font-bold transition-colors ${
                          startingLife === life 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {life}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    resetGame();
                    setShowSettings(false);
                  }}
                  className="w-full py-4 text-2xl bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg font-bold transition-colors"
                >
                  Reset Game Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dice/Coin Modal */}
      <AnimatePresence>
        {diceResult && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 flex flex-col items-center gap-12 shadow-2xl min-w-[400px]"
            >
              <span className="text-8xl font-bold tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] text-white">
                {diceResult}
              </span>
              <button 
                onPointerDown={() => setDiceResult(null)}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-4xl font-bold rounded-2xl transition-colors touch-none select-none"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlayerArea({ 
  player, 
  opponent,
  updatePlayer, 
  rotate 
}: { 
  player: Player; 
  opponent: Player;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  rotate: boolean;
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeCounter, setActiveCounter] = useState<'poison' | 'energy' | 'experience' | 'commander' | null>(null);

  const [plusDelta, setPlusDelta] = useState(0);
  const [minusDelta, setMinusDelta] = useState(0);
  const plusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (plusTimeoutRef.current) clearTimeout(plusTimeoutRef.current);
      if (minusTimeoutRef.current) clearTimeout(minusTimeoutRef.current);
    };
  }, []);

  const handlePlus = () => {
    changeLife(1);
    setPlusDelta(prev => prev + 1);
    if (plusTimeoutRef.current) clearTimeout(plusTimeoutRef.current);
    plusTimeoutRef.current = setTimeout(() => setPlusDelta(0), 1000);
  };

  const handleMinus = () => {
    changeLife(-1);
    setMinusDelta(prev => prev - 1);
    if (minusTimeoutRef.current) clearTimeout(minusTimeoutRef.current);
    minusTimeoutRef.current = setTimeout(() => setMinusDelta(0), 1000);
  };

  const changeLife = (amount: number) => {
    updatePlayer(player.id, { life: player.life + amount });
  };

  const changeCounter = (counter: 'poison' | 'energy' | 'experience', amount: number) => {
    updatePlayer(player.id, { [counter]: Math.max(0, player[counter] + amount) });
  };

  const changeCommanderDamage = (amount: number) => {
    const current = player.commanderDamage[opponent.id] || 0;
    updatePlayer(player.id, { 
      commanderDamage: { ...player.commanderDamage, [opponent.id]: Math.max(0, current + amount) } 
    });
  };

  const colors: PlayerColor[] = ['white', 'blue', 'black', 'red', 'green', 'colorless'];

  return (
    <div className={`flex-1 relative flex flex-col justify-center items-center transition-colors duration-500 ${COLOR_MAP[player.color]} ${rotate ? 'rotate-180' : ''}`}>
      
      {/* Life Tap Areas */}
      <div className="absolute inset-0 flex z-0 touch-none">
        <motion.button 
          className="relative flex-1 flex items-center justify-start pl-8 select-none" 
          whileTap="tapped"
          variants={{ tapped: { backgroundColor: "rgba(0,0,0,0.2)" } }}
          onPointerDown={handleMinus}
          aria-label="Decrease Life"
        >
          <AnimatePresence>
            {minusDelta < 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] pointer-events-none"
              >
                {minusDelta}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div variants={{ tapped: { opacity: 0.8 } }} className="opacity-40 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            <Minus size={96} />
          </motion.div>
        </motion.button>
        <motion.button 
          className="relative flex-1 flex items-center justify-end pr-8 select-none" 
          whileTap="tapped"
          variants={{ tapped: { backgroundColor: "rgba(0,0,0,0.2)" } }}
          onPointerDown={handlePlus}
          aria-label="Increase Life"
        >
          <AnimatePresence>
            {plusDelta > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] pointer-events-none"
              >
                +{plusDelta}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div variants={{ tapped: { opacity: 0.8 } }} className="opacity-40 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            <Plus size={96} />
          </motion.div>
        </motion.button>
      </div>

      {/* Main Life Display */}
      <div className="pointer-events-none z-10 flex flex-col items-center">
        <span className="text-[18rem] leading-none font-bold tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
          {player.life}
        </span>
      </div>

      {/* Top Left: Color Picker Toggle */}
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-colors"
        >
          <Palette size={30} className="opacity-70" />
        </button>
        
        <AnimatePresence>
          {showColorPicker && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -10 }}
              className="absolute top-16 left-0 flex flex-col gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl"
            >
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => {
                    updatePlayer(player.id, { color: c });
                    setShowColorPicker(false);
                  }}
                  className={`w-12 h-12 rounded-full border-[3px] ${player.color === c ? 'border-white' : 'border-transparent'} ${COLOR_MAP[c].split(' ')[0]}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Counters */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-6 z-20 pointer-events-none">
        
        {/* Active Counter Controls */}
        <AnimatePresence mode="wait">
          {activeCounter && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-6 bg-black/40 backdrop-blur-md p-3 rounded-3xl pointer-events-auto"
            >
              <motion.button 
                onPointerDown={() => activeCounter === 'commander' ? changeCommanderDamage(-1) : changeCounter(activeCounter, -1)}
                whileTap={{ scale: 0.95, backgroundColor: "rgba(0,0,0,0.4)" }}
                className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-2xl hover:bg-black/40 touch-none select-none"
              >
                <Minus size={36} />
              </motion.button>
              
              <div className="w-24 text-center flex flex-col items-center">
                <span className="text-5xl font-bold">
                  {activeCounter === 'commander' 
                    ? (player.commanderDamage[opponent.id] || 0) 
                    : player[activeCounter]}
                </span>
                <span className="text-sm uppercase tracking-wider opacity-70 mt-1">
                  {activeCounter}
                </span>
              </div>

              <motion.button 
                onPointerDown={() => activeCounter === 'commander' ? changeCommanderDamage(1) : changeCounter(activeCounter, 1)}
                whileTap={{ scale: 0.95, backgroundColor: "rgba(0,0,0,0.4)" }}
                className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-2xl hover:bg-black/40 touch-none select-none"
              >
                <Plus size={36} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Counter Toggles */}
        <div className="flex gap-4 pointer-events-auto">
          <CounterToggle 
            icon={<Droplet size={36} />} 
            value={player.poison} 
            isActive={activeCounter === 'poison'} 
            onClick={() => setActiveCounter(activeCounter === 'poison' ? null : 'poison')} 
          />
          <CounterToggle 
            icon={<ShieldAlert size={36} />} 
            value={player.commanderDamage[opponent.id] || 0} 
            isActive={activeCounter === 'commander'} 
            onClick={() => setActiveCounter(activeCounter === 'commander' ? null : 'commander')} 
          />
          <CounterToggle 
            icon={<Zap size={36} />} 
            value={player.energy} 
            isActive={activeCounter === 'energy'} 
            onClick={() => setActiveCounter(activeCounter === 'energy' ? null : 'energy')} 
          />
          <CounterToggle 
            icon={<GraduationCap size={36} />} 
            value={player.experience} 
            isActive={activeCounter === 'experience'} 
            onClick={() => setActiveCounter(activeCounter === 'experience' ? null : 'experience')} 
          />
        </div>
      </div>
    </div>
  );
}

function CounterToggle({ 
  icon, 
  value, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode; 
  value: number; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-sm transition-all ${
        isActive 
          ? 'bg-white text-black shadow-lg scale-110' 
          : value > 0 
            ? 'bg-black/60 text-white' 
            : 'bg-black/20 text-white/70 hover:bg-black/40'
      }`}
    >
      {icon}
      {value > 0 && <span className="font-bold text-2xl">{value}</span>}
    </button>
  );
}
