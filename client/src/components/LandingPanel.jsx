import { FaPlay, FaTag, FaBookOpen } from 'react-icons/fa';

function LandingPanel() {
  return (
    <section className=" bg-[#233D4D] text-white items-center justify-center py-16 px-8 xl:px-20  lg:flex">
      <div className="max-w-xl space-y-10">
        <div>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold">
            NostalgiaBoard
          </h1>

          <p className=" mt-6 text-lg md:text-xl text-gray-300 leading-relaxed">
            Rediscover your childhood — shop collectibles and rewatch classics
            from the 80s, 90s and early 2000s.
          </p>
        </div>

        <div className="space-y-4">
          <div className="card bg-[#2A2A59] shadow-lg">
            <div className="card-body p-5 flex-row items-center">
              <div className="bg-[#44447a] p-5 rounded-xl">
                <FaPlay size={28} />
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-xl">DuckTales — ep.1 (1987)</h2>

                <p className="text-gray-400">YouTube • TV Shows</p>
              </div>

              <div className="badge badge-error">YouTube</div>
            </div>
          </div>

          <div className="card bg-[#2A2A59] shadow-lg">
            <div className="card-body flex-row items-center">
              <div className="bg-[#44447a] p-5 rounded-xl">
                <FaTag size={28} />
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-xl">Sega Genesis Console</h2>

                <p className="text-gray-400">$89.99 • Collectibles</p>
              </div>

              <div className="badge badge-warning">eBay</div>
            </div>
          </div>

          <div className="card bg-[#2A2A59] shadow-lg">
            <div className="card-body flex-row items-center">
              <div className="bg-[#44447a] p-5 rounded-xl">
                <FaBookOpen size={28} />
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-xl">X-Men #1 (1991)</h2>

                <p className="text-gray-400">$34.00 • Comics</p>
              </div>

              <div className="badge badge-warning">eBay</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPanel;
