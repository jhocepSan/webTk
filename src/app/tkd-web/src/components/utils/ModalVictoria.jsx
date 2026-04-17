import { useEffect} from 'react';
import confetti from 'canvas-confetti';

const ModalVictoria = ({ show, handleClose }) => {
  useEffect(() => {
    if (show) {
      // 1. Sonido
      const audio = new Audio('./aplausos.mp3');
      audio.play().catch(e => console.log("Audio bloqueado"));

      // 2. Serpentinas
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // 3. CIERRE AUTOMÁTICO
      const timer = setTimeout(() => {
        handleClose();
      }, duration); // Usamos los mismos 3000ms

      return () => clearTimeout(timer); // Limpieza al desmontar
    }
  }, [show, handleClose]);

  return (
    <></>
  );
};

export default ModalVictoria;
