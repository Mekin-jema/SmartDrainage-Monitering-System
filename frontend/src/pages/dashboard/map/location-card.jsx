import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Star,
  MapPin,
  Bookmark,
  Share2,
  Phone,
  Info,
  Globe,
  Clock,
  LocateIcon, ShieldCheck, History, Tag,
  Route, Smartphone,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
const actions = [
  { label: "Directions", icon: <Route className="w-5 h-5" />, active: true },
  { label: "Save", icon: <Bookmark className="w-5 h-5" /> },
  { label: "Nearby", icon: <LocateIcon className="w-5 h-5" /> },
  { label: "Send to phone", icon: <Smartphone className="w-5 h-5" /> },
  { label: "Share", icon: <Share2 className="w-5 h-5" /> },
];

export default function LocationCard() {
  return (
    <Card className="max-w-md mx-5 z-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="p-0">
        <img
          src="/icons/megenagna.jpg"
          alt="Megenagna"
          className="w-full h-48 object-cover"
        />
      </CardHeader>

      <CardContent className="p-5">

        <CardTitle className="text-xl font-semibold">Megenagna</CardTitle>

        {/* Ratings */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-500">
            {[...Array(3)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
            <Star size={16} strokeWidth={1} className="text-gray-400" />
          </div>
          <span className="text-gray-600 text-sm ml-2">(53 reviews)</span>
        </div>

        {/* Actions */}
        <Tabs defaultValue="overview" className="w-full max-w-lg mx-auto mt-10">
        <TabsList className="grid w-full grid-cols-3">
  <TabsTrigger
    value="overview"
    className="text-lg pb-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-4 data-[state=active]:border-blue-600"
  >
    Overview
  </TabsTrigger>
  <TabsTrigger
    value="reviews"
    className="text-lg pb-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-4 data-[state=active]:border-blue-600"
  >
    Reviews
  </TabsTrigger>
  <TabsTrigger
    value="contact"
    className="text-lg pb-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-4 data-[state=active]:border-blue-600"
  >
    Contact
  </TabsTrigger>
</TabsList>



          {/* Updated Overview Tab Content */}
          <TabsContent value="overview" className="p-4 border rounded-lg shadow">
            <div className="flex justify-between items-center border rounded-lg p-4 max-w-3xl mx-auto bg-white shadow-sm">
              {actions.map((action, index) => (
                <div key={index} className="flex flex-col items-center space-y-1 cursor-pointer">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full border ${action.active ? "bg-blue-600 text-white border-blue-600" : "text-blue-600 border-blue-600"
                      }`}
                  >
                    {action.icon}
                  </div>
                  <span className={`text-sm ${action.active ? "text-blue-600 font-semibold" : "text-blue-600"}`}>
                    {action.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 mb-2 ">
              <MapPin size={18} />
              <span>Megenagna, Megenagna Building, Addis Ababa</span>
            </div>
            <div className="flex items-center space-x-2 mb-2 ">
              <LocateIcon size={18} />
              <span>2RC2+5X Addis Ababa</span>
            </div>
            <div className="flex items-center space-x-2 mb-2  cursor-pointer">
              <ShieldCheck size={18} />
              <span>Claim this business</span>
            </div>
            <div className="flex items-center space-x-2 mb-2  cursor-pointer">
              <History size={18} />
              <span>Your Maps activity</span>
            </div>
            <div className="flex items-center space-x-2 mb-4  cursor-pointer">
              <Tag size={18} />
              <span>Add a label</span>
            </div>

            <button className="border px-4 py-2 rounded-lg  hover:bg-gray-100">
              Suggest an edit
            </button>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Add Missing Information</h3>
              <div className="flex items-center space-x-2 mb-2 text-blue-600 cursor-pointer">
                <Phone size={18} />
                <span>Add place's phone number</span>
              </div>
              <div className="flex items-center space-x-2 mb-2 text-blue-600 cursor-pointer">
                <Clock size={18} />
                <span>Add hours</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600 cursor-pointer">
                <Globe size={18} />
                <span>Add website</span>
              </div>
            </div>
          </TabsContent>

          {/* Example Reviews Tab */}
       {/* Reviews Tab */}
<TabsContent value="reviews" className="p-4 border rounded-lg shadow">
  <h2 className="text-xl font-semibold mb-2">User Reviews</h2>
  <p>⭐⭐⭐☆ (3.7/5)</p>
  <p>54 reviews from visitors sharing their experiences.</p>

  {/* Example Reviews */}
  <div className="mt-4 space-y-4">

    <div>
      <p className="font-semibold">biruk tafese</p>
      <p>⭐⭐⭐⭐⭐ · 6 months ago</p>
      <p>Amazing hot spot on Addis Ababa</p>
    </div>

    <div>
      <p className="font-semibold">Leo <span className="text-gray-500">· Local Guide · 433 reviews · 3,079 photos</span></p>
      <p>⭐⭐⭐⭐⭐ · 2 months ago</p>
      <p>WoW, buildings and bribes going up and brains going lost</p>
    </div>

    <div>
      <p className="font-semibold">Beek Kefyalew <span className="text-gray-500">· Local Guide · 9 reviews · 29 photos</span></p>
      <p>⭐⭐⭐⭐⭐ · 4 years ago</p>
      <p>One of the very crowded places in Addis Ababa, Ethiopia. Lots of government and public offices, banks, shops and populated coffee places for shorter meetings or quick sip. Stay aware of the theft of mobile and property.</p>
    </div>

    <div>
      <p className="font-semibold">michael kiros <span className="text-gray-500">· Local Guide · 20 reviews · 20 photos</span></p>
      <p>⭐⭐⭐⭐⭐ · 4 years ago</p>
      <p>Tough point to pass, especially on rush hours. Jams in all directions but Maps calculates the easier ones. No good without it.</p>
    </div>

    <div>
      <p className="font-semibold">Ashu</p>
      <p>⭐⭐⭐⭐⭐ · 4 months ago</p>
      <p>Hard to find Taxi.</p>
    </div>

    <div>
      <p className="font-semibold">Markos Takaro</p>
      <p>⭐⭐⭐⭐⭐ · a month ago</p>
      <p>Good</p>
    </div>

    <div>
      <p className="font-semibold">Kidus Daniel</p>
      <p>⭐⭐⭐⭐⭐ · 4 months ago</p>
      <p>So crowded</p>
    </div>

  </div>
</TabsContent>


          {/* Example Contact Tab */}
          <TabsContent value="contact" className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Contact Info</h2>
            <p>📞 +251 912 345 678</p>
            <p>🌐 www.megenagna.com</p>
          </TabsContent>
        </Tabs>



      </CardContent>

      {/* Optional Footer */}
      <CardFooter></CardFooter>
    </Card>
  );
}
