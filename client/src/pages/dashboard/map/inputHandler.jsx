import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setWaypoints } from "../../../store/MapSlice";
import AddressInput from "./Input";
import RenderDirectionDetail from "./drectionDetail";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Car, Bus, MapPin, X, Bike, Plus } from "lucide-react";
import {
  MdDirections,
  MdDirectionsCarFilled,
  MdDirectionsTransitFilled,
  MdDirectionsWalk,
  MdOutlineAirplanemodeActive,
} from "react-icons/md";

const AddressBox = ({ route, setToggleGeocoding, profile, setProfile }) => {
  const dispatch = useDispatch();
  const { waypoints } = useSelector((state) => state.map);
  const controls = useAnimation();

  console.log(route);
  useEffect(() => {
    // Start with the infinite pulse animation
    controls.start({
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    // After 2 seconds, transition to the final state
    const timer = setTimeout(() => {
      controls.start({
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [controls]);

  // Add a new waypoint
  const addWaypoint = () => {
    const lastWaypoint = waypoints[waypoints.length - 1];
    if (
      !lastWaypoint.placeName ||
      lastWaypoint.longitude === null ||
      lastWaypoint.latitude === null
    ) {
      toast.error(
        "Please complete the previous waypoint before adding a new one.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      return;
    }
    dispatch(
      setWaypoints([
        ...waypoints,
        { placeName: "", longitude: null, latitude: null },
      ])
    );
  };

  // Update a specific waypoint
  const updateWaypoint = (index, address) => {
    const updatedWaypoints = [...waypoints];
    updatedWaypoints[index] = address;
    dispatch(setWaypoints(updatedWaypoints));
  };

  return (
    <Card className="fixed p-0 left-0 top-0 z-50 w-[430px] h-screen rounded-[5px] dark:bg-inherit  overflow-hidden">
      <motion.div
        initial={{ x: -500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -500, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div animate={controls} className="h-full">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-2 w-full font-sora ">
              <div className="flex items-center p-2 w-[300px] gap-2 ml-[5px] h-full">
                <button
                  title="Car"
                  className={`p-3 rounded-full  transition-all duration-200  ${profile === "auto"
                    ? "text-[#A91CD8] "
                    : " hover:text-[#b8a5be]"
                    }`}
                  onClick={() => setProfile("auto")}
                >
                  <MdDirections className="text-2xl" />
                </button>

                <button
                  title="Motor Scooter"
                  className={`p-3 rounded-full transition-all duration-200 ${profile === "motor_scooter"
                    ? "  text-[#A91CD8] "
                    : " hover:text-[#b8a5be]"
                    }`}
                  onClick={() => setProfile("motor_scooter")}
                >
                  <MdDirectionsCarFilled className="text-2xl" />
                </button>

                <button
                  title="Pedestrian"
                  className={`p-3 rounded-full  transition-all duration-200 ${profile === "pedestrian"
                    ? "  text-[#A91CD8] "
                    : " hover:text-[#b8a5be]"
                    }`}
                  onClick={() => setProfile("pedestrian")}
                >
                  <MdDirectionsWalk className="text-2xl" />
                </button>

                <button
                  title="Bicycle"
                  className={`p-3 rounded-full  transition-all duration-200 ${profile === "bicycle"
                    ? "  text-[#A91CD8] "
                    : " hover:text-[#b8a5be]"
                    }`}
                  onClick={() => setProfile("bicycle")}
                >
                  <Bike className="text-2xl" />
                </button>

                <button
                  title="Multimodal"
                  className={`p-3 rounded-full  transition-all duration-200 ${profile === "multimodal"
                    ? "  text-[#A91CD8] "
                    : " hover:text-[#b8a5be]"
                    }`}
                  onClick={() => setProfile("multimodal")}
                >
                  <MdOutlineAirplanemodeActive className="text-2xl" />
                </button>
              </div>

              <button
                title="Close"
                onClick={() => setToggleGeocoding(false)}
                className={`p-3 rounded-full  transition-all duration-200 
                   hover:text-[#b8a5be]
                  `}
              >
                <X width={25} height={25} />
              </button>
            </div>
            {waypoints.map((waypoint, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <AddressInput
                  location={waypoint.placeName}
                  index={index}
                  waypoint={waypoint}
                  setAddress={(address) => updateWaypoint(index, address)}
                  placeholder={
                    index === 0
                      ? "Starting Address"
                      : `Destination Address ${index}`
                  }
                  className="w-full p-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            ))}

            {waypoints.length >= 2 &&
              waypoints[1].longitude !== null &&
              waypoints[0].latitude !== null && (
                <motion.div
                  className="flex items-center gap-3 ml-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: waypoints.length * 0.1 + 0.5 }}
                >
                  <button
                    title="Add Destination"
                    className="rounded-full border-[2px] border-[#A91CD8] dark:border-white   flex items-center justify-center"
                    onClick={addWaypoint}
                  >
                    <Plus className="w-5 h-5 text-[#A91CD8]" />
                  </button>
                  <span className="text-lg ml-6 font-sora">
                    Add destination
                  </span>
                </motion.div>
              )}
          </CardContent>

          <CardFooter className="p-0 w-full">
            <div className="w-full">
              {/* <RenderDirectionDetail route={route} /> */}
            </div>
          </CardFooter>
        </motion.div>
      </motion.div>
    </Card>
  );
};

export default AddressBox;
