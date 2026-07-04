import heroImage from '../assets/HeroSection.jpg';
import carouselImage1 from '../assets/HeroPartImages1.jpg';
import carouselImage2 from '../assets/HersoSectionImage2.jpg';
import carouselImage3 from '../assets/HeroSectionImage3.jpg';
import carouselImage4 from '../assets/HeroSectionImage4.jpg';

export default function HeroSection() {
  return (
    <div>
      {/* Hero */}
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-6xl md:text-7xl font-bold">
              Nostalgia Board Treasure
            </h1>
            <p className="mb-5 text-lg md:text-xl">
              Welcome! Rediscover your childhood here!
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex justify-center py-10 px-4">
        <div className="carousel rounded-box w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
          <div className="carousel-item w-1/2 md:w-1/3 lg:w-1/4">
            <img src={carouselImage1} className="w-full" />
          </div>
          <div className="carousel-item w-1/2 md:w-1/3 lg:w-1/4">
            <img src={carouselImage2} className="w-full" />
          </div>
          <div className="carousel-item w-1/2 md:w-1/3 lg:w-1/4">
            <img src={carouselImage3} className="w-full" />
          </div>
          <div className="carousel-item w-1/2 md:w-1/3 lg:w-1/4">
            <img src={carouselImage4} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
