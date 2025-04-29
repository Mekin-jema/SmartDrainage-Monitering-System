// Traffic Jam Legend component

const jamStyles = ` w-[18px] h-[18px] inline-bloack mr-[8px]`;
const TrafficLegend = () => (
  <div className="absolute bottom-0 right-[600px] bg-white p-[10px] rounded-[5px] shadow-[0 0 15px rgba(0, 0, 0, 0.2)]">
    <h4>Jam Factor</h4>
    <div className={`bg-[#2ECC40] ${jamStyles}`}>0-3: Low Congestion</div>
    <div className={`bg-[#FF851B] ${jamStyles}`}>4-7: Low Congestion</div>
    <div className={`bg-[#FF4136] ${jamStyles}`}>8-10: Low Congestion</div>
  </div>
);

export default TrafficLegend;
