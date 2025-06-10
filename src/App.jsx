import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Calendar, Clock, Users, Link, Globe } from 'lucide-react';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef(null);

  // Enhanced event data with full details
  const events = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "July 15, 2024",
      time: "6:00 PM - 11:00 PM",
      location: "Central Park, New York",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      description: "Join us for an unforgettable evening of live music featuring top artists from around the world. Experience multiple stages, food vendors, and a vibrant atmosphere under the stars.",
      isOnline: false,
      attendees: 5000,
      category: "Music",
      organizer: "NYC Events Co."
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      date: "August 22, 2024",
      time: "9:00 AM - 6:00 PM",
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      description: "Discover the latest innovations in technology with keynote speakers, workshops, and networking opportunities. Connect with industry leaders and explore cutting-edge solutions.",
      isOnline: true,
      meetingLink: "https://zoom.us/j/123456789",
      attendees: 2500,
      category: "Technology",
      organizer: "TechWorld Inc."
    },
    {
      id: 3,
      title: "Art Gallery Opening",
      date: "September 10, 2024",
      time: "7:00 PM - 10:00 PM",
      location: "Modern Art Museum, Downtown",
      image: "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      description: "Celebrate the opening of our newest contemporary art exhibition featuring works from emerging and established artists. Enjoy wine, hors d'oeuvres, and inspiring conversations.",
      isOnline: false,
      attendees: 300,
      category: "Art & Culture",
      organizer: "Modern Art Museum"
    },
    {
      id: 4,
      title: "Food & Wine Expo",
      date: "October 5, 2024",
      time: "12:00 PM - 8:00 PM",
      location: "Downtown Plaza Convention Center",
      image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      description: "Indulge in a culinary journey featuring the finest local restaurants, wineries, and specialty food vendors. Participate in cooking demonstrations and wine tastings.",
      isOnline: false,
      attendees: 1200,
      category: "Food & Beverage",
      organizer: "Culinary Events LLC"
    },
    {
      id: 5,
      title: "Virtual Fashion Week",
      date: "November 18, 2024",
      time: "2:00 PM - 9:00 PM",
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      description: "Experience the future of fashion in our immersive virtual runway shows. Discover new designers, trends, and sustainable fashion initiatives from the comfort of your home.",
      isOnline: true,
      meetingLink: "https://fashionweek.virtual/live",
      attendees: 10000,
      category: "Fashion",
      organizer: "Global Fashion Network"
    },
    {
      id: 6,
      title: "Sports Championship",
      date: "December 3, 2024",
      time: "3:00 PM - 7:00 PM",
      location: "Stadium Arena, Sports Complex",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      description: "Witness the ultimate showdown as top teams compete for the championship title. Experience the thrill of live sports with premium seating and exclusive fan experiences.",
      isOnline: false,
      attendees: 15000,
      category: "Sports",
      organizer: "Sports League Association"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isDragging || isModalOpen) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isDragging, isModalOpen, events.length]);

  // Smooth scroll to specific index
  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const cardWidth = 320;
      const scrollPosition = index * cardWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? events.length - 1 : currentIndex - 1;
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % events.length;
    scrollToIndex(newIndex);
  };

  // Modal handlers
  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setIsAutoPlaying(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setTimeout(() => setIsAutoPlaying(true), 500);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsAutoPlaying(true), 1000);
    
    if (carouselRef.current) {
      const cardWidth = 320;
      const scrollPosition = carouselRef.current.scrollLeft;
      const nearestIndex = Math.round(scrollPosition / cardWidth);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, events.length - 1));
      scrollToIndex(clampedIndex);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsAutoPlaying(true), 1000);
    
    if (carouselRef.current) {
      const cardWidth = 320;
      const scrollPosition = carouselRef.current.scrollLeft;
      const nearestIndex = Math.round(scrollPosition / cardWidth);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, events.length - 1));
      scrollToIndex(clampedIndex);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current && !isDragging) {
      const cardWidth = 320;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== currentIndex) {
        setCurrentIndex(Math.max(0, Math.min(newIndex, events.length - 1)));
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      {/* Events Title */}
      <h1 className="text-white text-4xl md:text-6xl font-bold mb-16 tracking-wider">
        EVENTS
      </h1>

      {/* Carousel Container */}
      <div className="relative w-full max-w-7xl">
        {/* Scrollable Carousel */}
        <div
          ref={carouselRef}
          className={`flex gap-10 overflow-x-auto scrollbar-hide pb-4 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: isDragging ? 'auto' : 'smooth'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onScroll={handleScroll}
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => openModal(event)}
              className="group relative flex-shrink-0 w-70 h-80 md:w-80 md:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out hover:scale-110 hover:shadow-3xl hover:rotate-1 select-none cursor-pointer"
              style={{
                backgroundImage: `url(${event.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                scrollSnapAlign: 'start'
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-2">
                  {event.isOnline ? (
                    <Globe className="w-4 h-4 text-green-400" />
                  ) : (
                    <MapPin className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-xs font-medium text-gray-300">
                    {event.isOnline ? 'Online Event' : 'In-Person'}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-sm opacity-90 mb-1">{event.date}</p>
                <p className="text-sm opacity-75">{event.isOnline ? 'Virtual Event' : event.location}</p>
                <div className="mt-3 text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                  Click for details
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                   style={{
                     boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.1)'
                   }} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group z-10"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group z-10"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-12 gap-3">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/30 hover:bg-white/50 hover:scale-110'
            }`}
          />
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center text-white/60">
        <p className="text-sm">Drag to slide • Click for details • Auto-play pauses on interaction</p>
      </div>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="relative">
              <div
                className="h-64 bg-cover bg-center rounded-t-3xl"
                style={{
                  backgroundImage: `url(${selectedEvent.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedEvent.isOnline ? (
                      <Globe className="w-5 h-5 text-green-400" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-400" />
                    )}
                    <span className="text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      {selectedEvent.isOnline ? 'Online Event' : 'In-Person Event'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold">{selectedEvent.title}</h2>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{selectedEvent.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold">{selectedEvent.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Expected Attendees</p>
                    <p className="font-semibold">{selectedEvent.attendees.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold">{selectedEvent.category}</p>
                  </div>
                </div>
              </div>

              {/* Location or Meeting Link */}
              <div className="mb-8">
                {selectedEvent.isOnline ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-800">Online Event</h3>
                    </div>
                    <p className="text-green-700 mb-4">Join this event from anywhere in the world!</p>
                    <div className="flex items-center gap-3">
                      <Link className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm text-green-600 mb-1">Meeting Link</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={selectedEvent.meetingLink || ''}
                            readOnly
                            className="flex-1 bg-white border border-green-300 rounded-lg px-3 py-2 text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(selectedEvent.meetingLink || '')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-800">Event Location</h3>
                    </div>
                    <p className="text-blue-700 mb-2">Join us in person at:</p>
                    <p className="text-lg font-semibold text-blue-900">{selectedEvent.location}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Organizer */}
              <div className="border-t pt-6">
                <p className="text-sm text-gray-500 mb-1">Organized by</p>
                <p className="font-semibold text-lg">{selectedEvent.organizer}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200">
                  Register Now
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200">
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;