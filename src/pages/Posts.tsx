import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Posts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los posts",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, toast]);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const postData = {
      user_id: user.id,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as string,
    };

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      setDialogOpen(false);
      toast({
        title: "Post creado",
        description: "El post se ha creado exitosamente",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el post",
      });
    }
  };

  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !editingPost) return;

    const formData = new FormData(e.currentTarget);
    const postData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as string,
    };

    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', editingPost.id)
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => prev.map(post => post.id === editingPost.id ? data : post));
      setEditingPost(null);
      setDialogOpen(false);
      toast({
        title: "Post actualizado",
        description: "El post se ha actualizado exitosamente",
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el post",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post eliminado",
        description: "El post se ha eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el post",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      default: return 'outline';
    }
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setDialogOpen(true);
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Posts</h1>
          <p className="text-muted-foreground">
            Gestiona tu contenido y crea nuevos posts
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Editar Post' : 'Crear Nuevo Post'}
              </DialogTitle>
              <DialogDescription>
                {editingPost 
                  ? 'Modifica los detalles de tu post'
                  : 'Crea un nuevo post para tu blog'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingPost?.title || ''}
                  placeholder="Título del post"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingPost?.content || ''}
                  placeholder="Escribe el contenido de tu post..."
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select name="status" defaultValue={editingPost?.status || 'draft'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPost ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay posts aún</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comienza creando tu primer post para compartir con el mundo
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Crear mi primer post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>
                      Creado el {new Date(post.created_at).toLocaleDateString()} • 
                      Actualizado el {new Date(post.updated_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(post.status)}>
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(post)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;