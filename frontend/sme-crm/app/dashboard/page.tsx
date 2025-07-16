'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  MapPin, 
  Users, 
  TrendingUp, 
  Plus,
  Filter,
  Download,
  Settings,
  Bell,
  User,
  LogOut,
  Target,
  BarChart3,
  Calendar,
  Phone,
  Mail,
  Building,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LeadDetailModal from '@/components/modals/lead-detail-modal';
import AddLeadModal from '@/components/modals/add-lead-modal';

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadDetailOpen, setIsLeadDetailOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data for leads
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "Bella Vista Restaurant",
      category: "Restaurant",
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      email: "info@bellavista.com",
      status: "New",
      rating: 4.5,
      lastContact: "2024-01-15",
      notes: "Interested in catering services",
      website: "https://bellavista.com",
      contactPerson: "Maria Rodriguez"
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      category: "Technology",
      address: "456 Business Ave, Tech District",
      phone: "(555) 987-6543",
      email: "contact@techsolutions.com",
      status: "Contacted",
      rating: 4.2,
      lastContact: "2024-01-12",
      notes: "Follow up next week",
      website: "https://techsolutions.com",
      contactPerson: "John Smith"
    },
    {
      id: 3,
      name: "Green Thumb Landscaping",
      category: "Services",
      address: "789 Garden Rd, Suburbs",
      phone: "(555) 456-7890",
      email: "hello@greenthumb.com",
      status: "Qualified",
      rating: 4.8,
      lastContact: "2024-01-10",
      notes: "Ready for proposal",
      website: "https://greenthumb.com",
      contactPerson: "Sarah Johnson"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Contacted": return "bg-yellow-100 text-yellow-800";
      case "Qualified": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsLeadDetailOpen(true);
  };

  const handleSaveLead = (updatedLead: Lead) => {
    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    setIsLeadDetailOpen(false);
  };

  const handleAddLead = (newLeadData: any) => {
    const newLead: Lead = {
      id: Math.max(...leads.map(l => l.id)) + 1,
      ...newLeadData,
      rating: 0,
      lastContact: new Date().toISOString().split('T')[0]
    };
    setLeads([...leads, newLead]);
    setIsAddLeadOpen(false);
  };

  const handleDeleteLead = (leadId: number) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LeadFinder CRM</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-white border-r border-gray-200 min-h-screen`}>
          <nav className="p-4 space-y-2">
            <Button 
              variant={activeTab === "search" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("search");
                setMobileMenuOpen(false);
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Lead Search
            </Button>
            <Button 
              variant={activeTab === "leads" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("leads");
                setMobileMenuOpen(false);
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              My Leads ({leads.length})
            </Button>
            <Button 
              variant={activeTab === "analytics" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("analytics");
                setMobileMenuOpen(false);
              }}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("settings");
                setMobileMenuOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leads.length}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leads.filter(lead => lead.status === 'Qualified').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leads.filter(lead => lead.status === 'New').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  New leads added
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Find New Leads</h2>
                <Button onClick={() => setIsAddLeadOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Manual Lead
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Filters */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Search Filters</CardTitle>
                    <CardDescription>
                      Refine your search to find the perfect leads
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter city, zip code, or address"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Business Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., restaurants, retail, services"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        placeholder="Additional search terms"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Button className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Search Leads
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Advanced Filters
                    </Button>
                  </CardContent>
                </Card>

                {/* Map and Results */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Map Placeholder */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 h-96 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                          <p className="text-gray-600 text-lg">Interactive Google Maps</p>
                          <p className="text-gray-500 text-sm mt-2">Search results will appear here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Search Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Search Results</CardTitle>
                      <CardDescription>
                        Found 23 potential leads in your area
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leads.slice(0, 3).map((lead) => (
                          <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Building className="h-6 w-6 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{lead.name}</h3>
                                <p className="text-sm text-gray-600">{lead.address}</p>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600 ml-1">{lead.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" onClick={() => handleAddLead({
                              name: lead.name + " (Copy)",
                              category: lead.category,
                              address: lead.address,
                              phone: lead.phone,
                              email: lead.email,
                              status: "New",
                              notes: "Added from search results"
                            })}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Lead
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Leads</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setIsAddLeadOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lead
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Management</CardTitle>
                  <CardDescription>
                    Track and manage your lead pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{lead.name}</h3>
                              <Badge className={getStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{lead.category} • {lead.address}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-600">{lead.phone}</span>
                              </div>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-600">{lead.email}</span>
                              </div>
                            </div>
                            {lead.notes && (
                              <p className="text-sm text-gray-500 mt-1">Note: {lead.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewLead(lead)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteLead(lead.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics & Insights</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Performance</CardTitle>
                    <CardDescription>
                      Track your lead generation success
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 h-64 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Performance Charts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>
                      See how leads move through your pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>New Leads</span>
                        <span className="font-semibold">{leads.filter(l => l.status === 'New').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Contacted</span>
                        <span className="font-semibold">{leads.filter(l => l.status === 'Contacted').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Qualified</span>
                        <span className="font-semibold">{leads.filter(l => l.status === 'Qualified').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Closed</span>
                        <span className="font-semibold">{leads.filter(l => l.status === 'Closed').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isLeadDetailOpen}
        onClose={() => setIsLeadDetailOpen(false)}
        onSave={handleSaveLead}
      />

      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onSave={handleAddLead}
      />
    </div>
  );
};

export default Dashboard;