import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      <div className="countdown-box">
        <div className="countdown-number">{timeLeft.days}</div>
        <div className="countdown-label">أيام</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-number">{timeLeft.hours}</div>
        <div className="countdown-label">ساعات</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-number">{timeLeft.minutes}</div>
        <div className="countdown-label">دقائق</div>
      </div>
      <div className="countdown-box">
        <div className="countdown-number">{timeLeft.seconds}</div>
        <div className="countdown-label">ثواني</div>
      </div>
    </div>
  );
} 