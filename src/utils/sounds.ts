export const playSound = (type: 'slide' | 'break' | 'match') => {
    // Mock sound triggers for high-fidelity feel
    // In a real app, these would trigger short, sharp audio samples
    const styles = {
        slide: 'padding: 2px; background: #333; color: #fff; font-weight: bold;',
        break: 'padding: 2px; background: #FF3B30; color: #fff; font-weight: bold;',
        match: 'padding: 2px; background: #4CD964; color: #fff; font-weight: bold;',
    };

    console.log(`%c[SOUND_MOCK] ${type.toUpperCase()}`, styles[type]);
};
