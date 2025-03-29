import React, { useState, useRef } from "react";
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
  Presentation,
  Folder,
  MoreVertical,
  Calendar,
  Download,
  Star,
  StarOff,
  Users,
  Upload
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
    icon: Presentation,
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    setIsUploadDialogOpen(true);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    // Get the file type to determine the icon
    const fileName = selectedFile.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    
    let fileType = "document";
    let fileIcon = FileText;
    
    if (['xlsx', 'xls', 'csv'].includes(fileExtension)) {
      fileType = "spreadsheet";
      fileIcon = FileSpreadsheet;
    } else if (['pptx', 'ppt'].includes(fileExtension)) {
      fileType = "presentation";
      fileIcon = Presentation;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExtension)) {
      fileType = "image";
      fileIcon = FileImage;
    } else if (['pdf'].includes(fileExtension)) {
      fileType = "pdf";
      fileIcon = File;
    }

    // Create a new document object
    const newDocument = {
      id: documents.length + 1,
      name: fileName,
      type: fileType,
      icon: fileIcon,
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      created: new Date().toISOString().split('T')[0],
      modified: new Date().toISOString().split('T')[0],
      owner: "You",
      shared: false,
      starred: false,
      category: "uploads",
      folder: "Uploads"
    };

    // Add the new document to the documents array
    setDocuments([newDocument, ...documents]);

    // Close the dialog and reset the selected file
    setIsUploadDialogOpen(false);
    setSelectedFile(null);
    
    // Show a success toast
    toast({
      title: "File uploaded",
      description: `${fileName} has been uploaded successfully`,
    });
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
            <DropdownMenuItem onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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

      {/* File Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Select a file from your computer to upload to your documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
              onClick={handleBrowseClick}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {selectedFile ? (
                    <span className="text-primary">{selectedFile.name}</span>
                  ) : (
                    <span>Drag and drop or click to upload</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports all file types up to 10MB
                </p>
              </div>
              
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
              
              {selectedFile && (
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                  <p>Type: {selectedFile.type || "Unknown"}</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUploadSubmit} disabled={!selectedFile}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Documents;
