import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus,
  File,
  FileText,
  FileImage,
  FilePlus,
  FileSpreadsheet,
  Presentation, // Changed from FilePresentation to Presentation
  Folder,
  MoreVertical,
  Calendar,
  Download,
  Star,
  StarOff,
  Users
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const documentData = [
  {
    id: 1,
    name: "Q2 2023 Financial Report.xlsx",
    type: "spreadsheet",
    icon: FileSpreadsheet,
    size: "2.4 MB",
    created: "2023-06-15",
    modified: "2023-07-01",
    owner: "John Doe",
    shared: true,
    starred: true,
    category: "finance",
    folder: "Reports"
  },
  {
    id: 2,
    name: "Marketing Campaign Strategy.docx",
    type: "document",
    icon: FileText,
    size: "1.8 MB",
    created: "2023-06-10",
    modified: "2023-06-28",
    owner: "Jane Smith",
    shared: true,
    starred: false,
    category: "marketing",
    folder: "Marketing"
  },
  {
    id: 3,
    name: "Product Roadmap 2023.pptx",
    type: "presentation",
    icon: Presentation, // Changed from FilePresentation to Presentation
    size: "4.5 MB",
    created: "2023-05-22",
    modified: "2023-06-15",
    owner: "Robert Johnson",
    shared: true,
    starred: true,
    category: "product",
    folder: "Product Development"
  },
  {
    id: 4,
    name: "Company Logo.png",
    type: "image",
    icon: FileImage,
    size: "0.8 MB",
    created: "2023-03-10",
    modified: "2023-03-10",
    owner: "Emily Davis",
    shared: false,
    starred: false,
    category: "design",
    folder: "Brand Assets"
  },
  {
    id: 5,
    name: "Employee Handbook.pdf",
    type: "pdf",
    icon: File,
    size: "3.2 MB",
    created: "2023-01-15",
    modified: "2023-05-20",
    owner: "HR Department",
    shared: true,
    starred: false,
    category: "hr",
    folder: "HR Documents"
  },
  {
    id: 6,
    name: "Project Timeline.xlsx",
    type: "spreadsheet",
    icon: FileSpreadsheet,
    size: "1.5 MB",
    created: "2023-06-05",
    modified: "2023-07-02",
    owner: "Michael Wilson",
    shared: true,
    starred: false,
    category: "project",
    folder: "Project Management"
  },
  {
    id: 7,
    name: "Client Presentation.pptx",
    type: "presentation",
    icon: Presentation,
    size: "5.7 MB",
    created: "2023-06-18",
    modified: "2023-06-25",
    owner: "Sarah Brown",
    shared: true,
    starred: true,
    category: "sales",
    folder: "Sales"
  },
  {
    id: 8,
    name: "API Documentation.pdf",
    type: "pdf",
    icon: File,
    size: "2.1 MB",
    created: "2023-04-12",
    modified: "2023-06-30",
    owner: "Tech Team",
    shared: false,
    starred: false,
    category: "technical",
    folder: "Documentation"
  }
];

const folderData = [
  { id: 1, name: "Reports", files: 12, color: "blue" },
  { id: 2, name: "Marketing", files: 8, color: "green" },
  { id: 3, name: "Product Development", files: 15, color: "purple" },
  { id: 4, name: "Brand Assets", files: 24, color: "yellow" },
  { id: 5, name: "HR Documents", files: 6, color: "pink" },
  { id: 6, name: "Project Management", files: 9, color: "teal" },
  { id: 7, name: "Sales", files: 11, color: "orange" },
  { id: 8, name: "Documentation", files: 7, color: "indigo" }
];

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState(documentData);
  const [view, setView] = useState("grid");
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.folder.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const starredDocuments = documents.filter(doc => doc.starred);
  
  const handleToggleStar = (id: number) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id 
          ? { ...doc, starred: !doc.starred } 
          : doc
      )
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Layout>
      <Header 
        title="Documents" 
        description="Create, share and collaborate on documents."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Document
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Spreadsheet
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Presentation className="h-4 w-4 mr-2" />
              Presentation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Folder className="h-4 w-4 mr-2" />
              Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex">
          <Button 
            variant={view === "grid" ? "default" : "outline"} 
            size="icon" 
            className="rounded-r-none"
            onClick={() => setView("grid")}
          >
            <div className="grid grid-cols-2 gap-1">
              <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
              <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
              <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
              <div className="w-1.5 h-1.5 rounded-sm bg-current"></div>
            </div>
          </Button>
          <Button 
            variant={view === "list" ? "default" : "outline"} 
            size="icon" 
            className="rounded-l-none"
            onClick={() => setView("list")}
          >
            <div className="flex flex-col gap-1">
              <div className="w-4 h-1 rounded-sm bg-current"></div>
              <div className="w-4 h-1 rounded-sm bg-current"></div>
              <div className="w-4 h-1 rounded-sm bg-current"></div>
            </div>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="shared">Shared with me</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className={view === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
            : "space-y-2"
          }>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                view === "grid" ? (
                  <div key={doc.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-md bg-muted">
                        <doc.icon className="h-8 w-8 text-primary" />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => handleToggleStar(doc.id)}
                      >
                        {doc.starred 
                          ? <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> 
                          : <StarOff className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                    
                    <h3 className="font-medium mt-3 truncate" title={doc.name}>{doc.name}</h3>
                    
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{formatDate(doc.modified)}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <span className="text-xs bg-muted rounded-full px-2 py-1">
                        {doc.folder}
                      </span>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ) : (
                  <div key={doc.id} className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-muted mr-3">
                        <doc.icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-medium truncate" title={doc.name}>{doc.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span className="truncate">{doc.folder}</span>
                          <span className="mx-2">•</span>
                          <span>Modified {formatDate(doc.modified)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => handleToggleStar(doc.id)}
                        >
                          {doc.starred 
                            ? <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> 
                            : <StarOff className="h-4 w-4" />
                          }
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="font-medium text-lg">No documents found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="starred" className="space-y-6">
          <div className={view === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
            : "space-y-2"
          }>
            {starredDocuments.length > 0 ? (
              starredDocuments.map((doc) => (
                view === "grid" ? (
                  <div key={doc.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-md bg-muted">
                        <doc.icon className="h-8 w-8 text-primary" />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-yellow-500"
                        onClick={() => handleToggleStar(doc.id)}
                      >
                        <Star className="h-4 w-4 fill-yellow-500" />
                      </Button>
                    </div>
                    
                    <h3 className="font-medium mt-3 truncate" title={doc.name}>{doc.name}</h3>
                    
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{formatDate(doc.modified)}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <span className="text-xs bg-muted rounded-full px-2 py-1">
                        {doc.folder}
                      </span>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ) : (
                  <div key={doc.id} className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-muted mr-3">
                        <doc.icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-medium truncate" title={doc.name}>{doc.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span className="truncate">{doc.folder}</span>
                          <span className="mx-2">•</span>
                          <span>Modified {formatDate(doc.modified)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-yellow-500"
                          onClick={() => handleToggleStar(doc.id)}
                        >
                          <Star className="h-4 w-4 fill-yellow-500" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="font-medium text-lg">No starred documents</h3>
                <p className="text-muted-foreground mt-1">Star important documents to find them quickly.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="folders" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folderData.map((folder) => (
              <div key={folder.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-md bg-${folder.color}-100 mr-3`}>
                    <Folder className={`h-6 w-6 text-${folder.color}-600`} />
                  </div>
                  <h3 className="font-medium">{folder.name}</h3>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {folder.files} {folder.files === 1 ? 'file' : 'files'}
                </div>
              </div>
            ))}
            
            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow border-dashed flex flex-col items-center justify-center cursor-pointer h-[132px]">
              <FilePlus className="h-6 w-6 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">Create New Folder</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="shared" className="space-y-6">
          <div className={view === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
            : "space-y-2"
          }>
            {filteredDocuments.filter(doc => doc.shared).length > 0 ? (
              filteredDocuments
                .filter(doc => doc.shared)
                .map((doc) => (
                  view === "grid" ? (
                    <div key={doc.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-md bg-muted">
                          <doc.icon className="h-8 w-8 text-primary" />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => handleToggleStar(doc.id)}
                        >
                          {doc.starred 
                            ? <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> 
                            : <StarOff className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                      
                      <h3 className="font-medium mt-3 truncate" title={doc.name}>{doc.name}</h3>
                      
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span>Shared by: {doc.owner}</span>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="text-xs bg-muted rounded-full px-2 py-1">
                          {doc.folder}
                        </span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              Make a copy
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ) : (
                    <div key={doc.id} className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-muted mr-3">
                          <doc.icon className="h-6 w-6 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0 mr-4">
                          <h3 className="font-medium truncate" title={doc.name}>{doc.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span>Shared by: {doc.owner}</span>
                            <span className="mx-2">•</span>
                            <span>Modified {formatDate(doc.modified)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => handleToggleStar(doc.id)}
                          >
                            {doc.starred 
                              ? <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> 
                              : <StarOff className="h-4 w-4" />
                            }
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Make a copy
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  )
                ))
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="font-medium text-lg">No shared documents</h3>
                <p className="text-muted-foreground mt-1">Documents shared with you will appear here.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Documents;
