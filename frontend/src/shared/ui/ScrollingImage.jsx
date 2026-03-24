import './ScrollingImage.css';

export const ScrollingImage = ({ imageSrc, speed }) => {

  return (
    <div className="scrolling-container">
      <div
        className="scrolling-content"
        style={{
          animation: `scroll ${speed}s linear infinite`
        }}
      >
        <img src={imageSrc} alt="scrolling" />
      </div>
    </div>
  );
};
