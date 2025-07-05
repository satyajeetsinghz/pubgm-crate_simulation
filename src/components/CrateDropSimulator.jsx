// CrateDropSimulator.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { crateItems as items } from '../data/crates/anniversary_s6/crateItems'; // Import the items

function getRandomItem() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (const item of items) {
        cumulative += item.chance;
        if (roll <= cumulative) return item;
    }
    return items[items.length - 1];
}

export default function CrateDropSimulator() {
    const [history, setHistory] = useState([]);
    const [current, setCurrent] = useState(null);
    const [isOpening, setIsOpening] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [previewItem, setPreviewItem] = useState(items[0]);
    const [gradientColor, setGradientColor] = useState('from-yellow-600/20 via-purple-600/20 to-blue-600/20');

    useEffect(() => {
        setPreviewItem(items[0]);
    }, []);

    const openCrate = () => {
        if (isOpening) return;
        setIsOpening(true);
        setExploded(false);
        setShowReward(false);

        setTimeout(() => {
            const item = getRandomItem();
            setCurrent(item);
            setHistory([item, ...history.slice(0, 9)]);
            setExploded(true);
            setShowReward(true);
            setIsOpening(false);
        }, 1500);
    };

    const openWithUC = () => {
        openCrate();
    };

    const changeGradient = () => {
        const gradients = [
            'from-yellow-600/20 via-purple-600/20 to-blue-600/20',
            'from-red-600/20 via-pink-600/20 to-purple-600/20',
            'from-green-600/20 via-teal-600/20 to-blue-600/20',
            'from-orange-600/20 via-red-600/20 to-pink-600/20'
        ];
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        setGradientColor(randomGradient);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-start pt-4 md:pt-8 px-4 relative overflow-hidden">
            {/* Dynamic Gradient Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientColor}`}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: 'reverse'
                    }}
                />
                <div className="absolute inset-0 bg-[url('/images/pubg-bg-pattern.png')] opacity-10"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center mb-4 md:mb-8">
                <img
                    src="/images/items/nav_logo.avif"
                    alt="PUBG Mobile"
                    className="h-10 md:h-14 mb-2 object-contain"
                />
                <h1 className="text-xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                    CRATE DROP SIMULATOR
                </h1>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent my-2 opacity-50"></div>
            </div>

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-6">
                {/* Left side - Item Preview (transparent) */}
                <div className="w-full lg:w-[70%] flex flex-col items-center justify-center p-4 md:p-6">
                    <div className="w-full flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-4 md:mb-6">
                            <img
                                src={previewItem.image}
                                alt={previewItem.name}
                                className="w-full h-full object-contain"
                            />
                            <div className={`absolute inset-0 rounded-full ${previewItem.rarity === 'Mythic' ? 'bg-red-500/20' :
                                previewItem.rarity === 'Legendary' ? 'bg-pink-500/20' :
                                    'bg-gray-500/20'
                                } blur-lg -z-10`}></div>
                        </div>

                        <div className="text-left w-full px-2">
                            <h3 className={`text-lg md:text-xl lg:text-2xl font-bold ${previewItem.color}`}>
                                {previewItem.name}
                            </h3>
                            <p className="text-gray-300 text-xs md:text-sm mt-1">{previewItem.description}</p>
                            <p className={`text-xs px-3 py-1 mt-2 inline-block ${previewItem.bgColor} ${previewItem.borderColor} border`}>
                                {previewItem.rarity} • {previewItem.chance}% drop chance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side - Crate Contents */}
                <div className="w-full lg:w-[30%] flex flex-col">
                    <div className="bg-black/70 backdrop-blur-sm p-4 border border-yellow-600/30 h-full">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-base md:text-lg font-bold text-yellow-300 uppercase tracking-wider">Anniversary Crate</h2>
                            <button
                                onClick={changeGradient}
                                className="px-2 py-1 bg-yellow-600/30 rounded text-xs hover:bg-yellow-600/50 transition text-yellow-200"
                            >
                                Change Effect
                            </button>
                        </div>

                        {/* Crate Content Grid */}
                        <div className="grid grid-cols-3 gap-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-yellow-500/50 scrollbar-track-transparent">
                            {items.map((item, index) => (
                                <div key={index} className="relative p-[2px] overflow-visible">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setPreviewItem(item)}
                                        className={`
          relative overflow-hidden cursor-pointer transition-all 
          ${item.bgColor} 
          ${previewItem?.name === item.name ? 'ring-2 ring-yellow-400' : ''} 
          hover:z-10`}
                                        style={{
                                            width: '100%',
                                            aspectRatio: '1 / 1',
                                            minHeight: '100px',
                                            maxHeight: '140px',
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center p-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className={`absolute inset-0 rounded-md 
          ${item.rarity === 'Mythic' ? 'bg-red-500/10' :
                                                item.rarity === 'Legendary' ? 'bg-purple-500/10' :
                                                    'bg-gray-500/10'}`}></div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>


                    </div>

                    {/* Open Crate Buttons */}
                    <div className="flex gap-3 mt-4 w-full">
                        <motion.button
                            onClick={openCrate}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isOpening}
                            className={`flex-1 py-2.5 font-bold text-black text-sm relative overflow-hidden ${isOpening ? 'bg-gray-500/80 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300'
                                } shadow-lg shadow-yellow-500/20 flex items-center justify-center min-w-[120px]`}
                        >
                            {isOpening ? (
                                <span className="flex items-center justify-center">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="inline-block mr-2"
                                    >
                                        ⌛
                                    </motion.span>
                                    Opening...
                                </span>
                            ) : (
                                <>
                                    <span className="relative z-10 flex items-center">
                                        <span className="mr-1.5"></span> Open Crate
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-200 opacity-0 hover:opacity-100 transition-opacity z-0"></div>
                                </>
                            )}
                        </motion.button>

                        <motion.button
                            onClick={openWithUC}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isOpening}
                            className={`flex-1 py-2.5 font-bold text-white text-sm relative overflow-hidden ${isOpening ? 'bg-gray-500/80 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400'
                                } shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-[120px]`}
                        >
                            <span className="relative z-10 flex items-center">
                                <span className="mr-1.5"></span> Open with UC
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 opacity-0 hover:opacity-100 transition-opacity z-0"></div>
                        </motion.button>
                    </div>

                </div>

            </div>

            {/* Reward Popup - Responsive */}
            <AnimatePresence>
                {showReward && current && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-1"
                        initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' }}
                        animate={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.7)' }}
                        exit={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' }}
                    >
                        <motion.div
                            className="relative w-full max-w-full sm:h-[60vh] max-h-[400px] bg-black/80 border-2 border-yellow-500/50 flex flex-col"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-purple-600/10 to-blue-600/10"></div>
                            <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full">
                                <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">YOU GOT</h3>

                                <div className="flex-1 flex flex-col items-center justify-center w-full mb-4 sm:mb-2">
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 relative mb-4">
                                        <div className={`absolute inset-0 rounded-full ${current.rarity === 'Mythic' ? 'bg-red-500/30' :
                                            current.rarity === 'Legendary' ? 'bg-pink-500/30' :
                                                'bg-gray-500/30'
                                            } blur-xl`}></div>
                                        <img
                                            src={current.image}
                                            alt={current.name}
                                            className="relative z-10 w-full h-full object-contain animate-pulse-slow"
                                        />
                                    </div>
                                    <h4 className={`text-xs sm:text-sm font-bold ${current.color} text-center`}>
                                        {current.name}
                                    </h4>
                                </div>

                                <div className="flex gap-4 w-full justify-center">
                                    <button
                                        onClick={openCrate}
                                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 font-bold text-xs sm:text-sm text-black transition"
                                    >
                                        OPEN AGAIN
                                    </button>
                                    <button
                                        onClick={() => setShowReward(false)}
                                        className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-xs sm:text-sm font-bold text-white transition"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-8 mb-4 text-xs text-gray-500 text-center pb-4 relative z-10 px-4">
                <p>This is a fan-made simulator and not affiliated with PUBG Mobile.</p>
                <p>Drop rates are simulated and may not reflect actual game probabilities.</p>
            </div>
        </div>
    );
}