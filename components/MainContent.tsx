import React, { useState, useEffect } from 'react';

const MainContent = () => {
  const [selectedGear, setSelectedGear] = useState('P');
  const [speed, setSpeed] = useState(0);
  const [power, setPower] = useState(0);

  const gears = ['P', 'R', 'N', 'D', 'A'];

  const handleGearClick = (gear: string) => {
    setSelectedGear(gear);
  };

  const handleArrowClick = (direction: string) => {
    const currentIndex = gears.indexOf(selectedGear);
    let newIndex = currentIndex;

    if (direction === 'left' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < gears.length - 1) {
      newIndex = currentIndex + 1;
    }

    setSelectedGear(gears[newIndex]);
  };

  useEffect(() => {
    const updateSpeedAndPower = () => {
      const newSpeed = Math.floor(Math.random() * 240);
      const newPower = Math.floor(Math.random() * 500);

      setSpeed(newSpeed);
      setPower(newPower);

      updateArc('kmph-arc', 'kmph-pointer', newSpeed, 240);
      updateArc('kwh-arc', 'kwh-pointer', newPower, 500);
    };

    const intervalId = setInterval(updateSpeedAndPower, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const updateArc = (arcId: string, pointerId: string, value: number, maxValue: number) => {
    const arc = document.getElementById(arcId) as SVGPathElement | null;
    const pointer = document.getElementById(pointerId) as SVGCircleElement | null;
    const endAngle = (value / maxValue) * 270;
    const path = describeArc(121.5, 121.5, 115, -135, endAngle - 135);
    const pointerPos = polarToCartesian(121.5, 121.5, 115, endAngle - 135);

    if (arc) {
      arc.setAttribute('d', path);
    }
    if (pointer) {
      pointer.setAttribute('cx', pointerPos.x.toString());
      pointer.setAttribute('cy', pointerPos.y.toString());
    }
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  return (
    <div className="speedometer-container">
      <div className="circle-container">
        <div className="circle kw-h">
          <svg width="243" height="243" viewBox="0 0 243 243">
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#666666" />
                <stop offset="100%" stopColor="#2CBE6B" />
              </linearGradient>
            </defs>
            <circle cx="121.5" cy="121.5" r="115" fill="none" stroke="#000" />
            <path id="kwh-arc" className="arc" stroke="url(#greenGradient)" />
            <circle id="kwh-pointer" r="6" fill="#2CBE6B" />
          </svg>
          <div className="circle-text">
            <div className="number">{power}</div>
            <div className="unit">kw/h</div>
          </div>
        </div>
        <div className="car-container">
          <div className="gear-selector">
            <div
              className="gear-arrow gear-arrow-left"
              onClick={() => handleArrowClick('left')}
            ></div>
            {gears.map((gear) => (
              <button
                key={gear}
                className={`gear-button ${selectedGear === gear ? 'active' : ''}`}
                onClick={() => handleGearClick(gear)}
                style={{
                  color: selectedGear === gear ? '#fff' : '#00D1FF'
                }}
              >
                {gear}
              </button>
            ))}
            <div
              className="gear-arrow gear-arrow-right"
              onClick={() => handleArrowClick('right')}
            ></div>
            <div className="gear-selector-line"></div>
          </div>
          <div className="svg-composition">
            <img src="/images/Group.svg" alt="Group" className="group-svg" />
            <img src="/images/headlights.svg" alt="Headlight" className="headlight-svg" />
            <img src="/images/Group 427319060.svg" alt="Blue Path" className="blue-path" />
            <img src="/images/Vector 9.svg" alt="White Glow" className="white-glow" />
            <img src="/images/Group 427319053.svg" alt="Car" className="car-image" />
            <img src="/images/Ellipse.svg" alt="Ellipse" className="ellipse" />
          </div>
        </div>
        <div className="circle kw-ph">
          <svg width="243" height="243" viewBox="0 0 243 243">
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#666666" />
                <stop offset="100%" stopColor="#1FA1FF" />
              </linearGradient>
            </defs>
            <circle cx="121.5" cy="121.5" r="115" fill="none" stroke="#000" />
            <path id="kmph-arc" className="arc" stroke="url(#blueGradient)" />
            <circle id="kmph-pointer" r="6" fill="#1FA1FF" />
          </svg>
          <div className="circle-text">
            <div className="number">{speed}</div>
            <div className="unit">kmph</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
