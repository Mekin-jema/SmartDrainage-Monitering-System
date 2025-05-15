import React from "react";
import { useSelector } from "react-redux";
import maplibregl from "maplibre-gl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


import { DIRECTION_ARROWS } from "../constants/TurnByTurnArrows";

// Text-to-Speech Initialization
const synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();
}

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}
populateVoiceList();

const speakText = (text) => {
  if (synth.speaking) {
    synth.cancel();
  }
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = voices.find((voice) => voice.lang === "en-US") || voices[0];
  synth.speak(utterThis);
};

const RenderDirectionDetail = ({ map, route }) => {
  const { waypoints } = useSelector((state) => state.map);

  const steps = route?.legs[0]?.steps || [];
  console.log(steps)

  const handleStepClick = (step) => {
    if (map) {
      map.flyTo({
        center: step.maneuver.location,
        essential: true,
        zoom: 15,
      });

      new maplibregl.Marker({ color: "blue" })
        .setLngLat(step.maneuver.location)
        .addTo(map);

      new maplibregl.Popup({
        closeButton: false,
        className: "custom-popup",
      })
        .setLngLat(step.maneuver.location)
        .setHTML(
          `<div class="popup-content">
            <strong>Active Segment</strong><br/>
            ${step.name}
          </div>`
        )
        .setOffset([0, -30])
        .addTo(map);

      speakText(
        `Proceed ${step.distance} meters, then turn ${step.maneuver.modifier} onto ${step.name}.`
      );
    }
  };

  return (
    <Card className="z-20 flex flex-col shadow-lg  rounded-lg  w-full">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-lg font-semibold">Via Africa Venue</CardTitle>
        <CardDescription className="text-sm text-gray-300">
          <span>{((route?.duration || 0) / 60)?.toFixed(2)} min</span> (
          {((route?.distance || 0) / 1000)?.toFixed(2)} km)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {/* Origin Step */}
            <div className="py-4 hover:cursor-pointer transition-colors">
              <div className="flex items-center gap-2 mb-1 px-4">
                <span className="text-sm font-semibold">{steps[0]?.name}</span>
              </div>
              <span className="text-sm px-4">{steps[0]?.distance}m </span>
            </div>

            {/* Intermediate Steps */}
            {steps.map((step, idx) => {
              if (idx === 0 || idx === steps.length - 1) return null;

              return (
                <div
                  key={idx}
                  className={`py-4 hover:cursor-pointertransition-colors ${
                    waypoints.some(
                      (wp) =>
                        wp.latitude === step.maneuver.location[1] &&
                        wp.longitude === step.maneuver.location[0]
                    )
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => handleStepClick(step)}
                >
                  <div className="flex items-center gap-2 mb-1 px-4">
                    <span className=" rounded-full p-1">
                      <img
                        src={DIRECTION_ARROWS[step.maneuver.modifier]}
                        alt="Step icon"
                        className="w-5 h-5"
                      />
                    </span>
                    <span className="text-sm">{step.name}</span>
                  </div>
                  <span className="text-sm px-4">{step.distance} m</span>
                </div>
              );
            })}

            {/* Destination Step */}
            <div className="py-4 hover:cursor-pointer  transition-colors">
              <div className="flex items-center gap-2 mb-1 px-4">
              
                <span className="text-sm">
                  {steps[steps.length - 1]?.name}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RenderDirectionDetail;