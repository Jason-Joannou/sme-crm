'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Calendar,
  User,
  Save,
  X
} from "lucide-react";

interface Lead {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  rating: number;
  lastContact: string;
  notes: string;
  website?: string;
  contactPerson?: string;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose, onSave }) => {
  const [editedLead, setEditedLead] = useState<Lead | null>(lead);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    setEditedLead(lead);
    setIsEditing(false);
  }, [lead]);

  if (!lead || !editedLead) return null;

  const handleSave = () => {
    onSave(editedLead);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Contacted": return "bg-yellow-100 text-yellow-800";
      case "Qualified": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">{lead.name}</DialogTitle>
                <DialogDescription>{lead.category}</DialogDescription>
              </div>
            </div>
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedLead.phone}
                      onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      value={editedLead.email}
                      onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedLead.address}
                    onChange={(e) => setEditedLead({...editedLead, address: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{lead.address}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={editedLead.contactPerson || ''}
                    onChange={(e) => setEditedLead({...editedLead, contactPerson: e.target.value})}
                    placeholder="Primary contact name"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedLead.status}
                      onValueChange={(value) => setEditedLead({...editedLead, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{lead.rating}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Last Contact</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{new Date(lead.lastContact).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedLead.notes}
                  onChange={(e) => setEditedLead({...editedLead, notes: e.target.value})}
                  placeholder="Add notes about this lead..."
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">{lead.notes || 'No notes added yet.'}</p>
              )}
            </CardContent>
          </Card>

          {/* Activity History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Lead created</p>
                    <p className="text-xs text-gray-500">January 15, 2024 at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">First contact made</p>
                    <p className="text-xs text-gray-500">January 16, 2024 at 10:15 AM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Follow-up scheduled</p>
                    <p className="text-xs text-gray-500">January 18, 2024 at 3:45 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Lead
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;