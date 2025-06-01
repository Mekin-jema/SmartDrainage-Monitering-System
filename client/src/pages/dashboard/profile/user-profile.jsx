import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Loader2, Pencil, Check, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
    const { user, updateProfile } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        address: "",
        salary: 0,
        status: { availability: "available" },
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "Update your address",
                salary: user.salary || 0,
                status: {
                    availability: user.status?.availability || "available"
                }
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value) => {
        setFormData(prev => ({
            ...prev,
            status: { availability: value }
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateProfile(user._id, formData);
            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });
            setIsEditing(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const names = name.split(" ");
        return names.map(n => n[0]).join("").toUpperCase();
    };

    return (
        <Card className="p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Worker Profile</h2>
            <p className="text-sm mb-4">
                {isEditing ? "Update your profile details" : "View your profile information"}
            </p>

            <div className="grid gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback>{getInitials(user?.fullname)}</AvatarFallback>
                    </Avatar>
                    {isEditing ? (
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                            />
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-medium">{user?.fullname}</h3>
                            <p className="text-sm text-muted-foreground">{user?.role}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="text-sm">{user?.email}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        {isEditing ? (
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="10 digit phone number"
                            />
                        ) : (
                            <div className="text-sm">{user?.phone || "Not provided"}</div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <div className="text-sm">{user?.address}</div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="salary">Salary</Label>
                        {isEditing ? (
                            <Input
                                id="salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="text-sm">
                                {user?.salary ? `$${user.salary.toLocaleString()}` : "Not set"}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Availability</Label>
                        {isEditing ? (
                            <Select
                                value={formData.status.availability}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select availability" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="busy">Busy</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="text-sm capitalize">
                                {user?.status?.availability || "available"}
                            </div>
                        )}
                    </div>
                </div>

                {user?.assignments?.length > 0 && (
                    <div className="space-y-2">
                        <Label>Current Assignments</Label>
                        <div className="space-y-2">
                            {user.assignments.map((assignment, index) => (
                                <div key={index} className="p-3 border rounded-lg">
                                    <div className="font-medium">{assignment.task}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Manhole ID: {assignment.manholeId}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Assigned: {new Date(assignment.date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex gap-2 justify-end">
                {isEditing ? (
                    <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <Button onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default UserProfile;
