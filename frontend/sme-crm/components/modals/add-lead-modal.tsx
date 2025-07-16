'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import { Plus, Save, X } from "lucide-react";

interface NewLead {
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  notes: string;
  website?: string;
  contactPerson?: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: NewLead) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave }) => {
  const [newLead, setNewLead] = useState<NewLead>({
    name: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    status: 'New',
    notes: '',
    website: '',
    contactPerson: ''
  });

  const [errors, setErrors] = useState<Partial<NewLead>>({});

  const validateForm = () => {
    const newErrors: Partial<NewLead> = {};
    
    if (!newLead.name.trim()) newErrors.name = 'Business name is required';
    if (!newLead.category.trim()) newErrors.category = 'Category is required';
    if (!newLead.address.trim()) newErrors.address = 'Address is required';
    if (!newLead.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!newLead.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(newLead.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(newLead);
      handleClose();
    }
  };

  const handleClose = () => {
    setNewLead({
      name: '',
      category: '',
      address: '',
      phone: '',
      email: '',
      status: 'New',
      notes: '',
      website: '',
      contactPerson: ''
    });
    setErrors({});
    onClose();
  };

  const businessCategories = [
    'Restaurant',
    'Retail',
    'Technology',
    'Healthcare',
    'Professional Services',
    'Construction',
    'Real Estate',
    'Education',
    'Automotive',
    'Beauty & Wellness',
    'Entertainment',
    'Other'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Add New Lead
          </DialogTitle>
          <DialogDescription>
            Enter the details for your new lead. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Enter business name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newLead.category}
                  onValueChange={(value) => setNewLead({...newLead, category: value})}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={newLead.address}
                onChange={(e) => setNewLead({...newLead, address: e.target.value})}
                placeholder="Enter full address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  placeholder="contact@business.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={newLead.contactPerson}
                  onChange={(e) => setNewLead({...newLead, contactPerson: e.target.value})}
                  placeholder="Primary contact name"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newLead.website}
                  onChange={(e) => setNewLead({...newLead, website: e.target.value})}
                  placeholder="https://www.business.com"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lead Details</h3>
            
            <div>
              <Label htmlFor="status">Initial Status</Label>
              <Select
                value={newLead.status}
                onValueChange={(value) => setNewLead({...newLead, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newLead.notes}
                onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                placeholder="Add any additional notes about this lead..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;