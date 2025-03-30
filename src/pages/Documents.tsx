import React, { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { documentService, Document } from "@/services/documentService";
import { folderService, Folder as FolderType } from "@/services/folderService";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [view, setView] = useState("grid");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("blue");
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
  
  useEffect(() => {
    fetchDocuments();
    fetchFolders();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await documentService.getRecentDocuments(100); // Fetch up to 100 documents
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const folders = await folderService.getFolders();
      setFolders(folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch folders",
        variant: "destructive",
      });
    }
  };

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
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 20MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 20MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
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

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive",
      });
      return;
    }

    try {
      const newFolder = await folderService.createFolder(newFolderName, newFolderColor);
      if (newFolder) {
        setFolders([...folders, newFolder]);
        setIsCreateFolderDialogOpen(false);
        setNewFolderName("");
        toast({
          title: "Success",
          description: "Folder created successfully",
        });
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFolder = async (id: number) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this folder? All files in the folder will be deleted.');
      if (!confirmed) return;

      const success = await folderService.deleteFolder(id);
      if (success) {
        setFolders(folders.filter(folder => folder.id !== id));
        setDocuments(documents.filter(doc => doc.folder_id !== id));
        toast({
          title: "Success",
          description: "Folder deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      const loadingToast = toast({
        title: "Uploading document",
        description: "Please wait while we upload your file...",
      });

      const newDocument = await documentService.uploadDocument(selectedFile, selectedFolder?.id);
      
      if (newDocument) {
        setDocuments([newDocument, ...documents]);
        setIsUploadDialogOpen(false);
        setSelectedFile(null);
        setSelectedFolder(null);
        
        toast({
          title: "File uploaded",
          description: `${selectedFile.name} has been uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete this document?');
      if (!confirmed) return;

      // Show loading toast
      const loadingToast = toast({
        title: "Deleting document",
        description: "Please wait while we delete your file...",
      });

      // Delete the document
      const success = await documentService.deleteDocument(id);
      
      if (success) {
        // Remove the document from the documents array
        setDocuments(docs => docs.filter(doc => doc.id !== id));
        
        // Update loading toast to success
        toast({
          title: "Document deleted",
          description: "The document has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive",
      });
    }
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
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredDocuments.length > 0 ? (
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
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
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
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
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
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
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
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
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
            {folders.map((folder) => (
              <div 
                key={folder.id} 
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedFolder(folder)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md bg-${folder.color}-100 mr-3`}>
                      <Folder className={`h-6 w-6 text-${folder.color}-600`} />
                    </div>
                    <h3 className="font-medium">{folder.name}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {documents.filter(doc => doc.folder_id === folder.id).length} files
                </div>
              </div>
            ))}
            
            <div 
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow border-dashed flex flex-col items-center justify-center cursor-pointer h-[132px]"
              onClick={() => setIsCreateFolderDialogOpen(true)}
            >
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

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="folderColor">Color</Label>
              <Select value={newFolderColor} onValueChange={setNewFolderColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                  <SelectItem value="teal">Teal</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="indigo">Indigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Select a file from your computer to upload to your documents.
              Maximum file size is 20MB.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="folder">Upload to Folder</Label>
                <Select 
                  value={selectedFolder?.id?.toString() || "root"} 
                  onValueChange={(value) => {
                    if (value === "root") {
                      setSelectedFolder(null);
                    } else {
                      setSelectedFolder(folders.find(f => f.id === parseInt(value)) || null);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">Root</SelectItem>
                    {folders.map(folder => (
                      <SelectItem key={folder.id} value={folder.id.toString()}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
                onClick={handleBrowseClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
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
                    Supports all file types up to 20MB
                  </p>
                </div>
                
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg"
                />
                
                {selectedFile && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                    <p>Type: {selectedFile.type || "Unknown"}</p>
                  </div>
                )}
              </div>
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
