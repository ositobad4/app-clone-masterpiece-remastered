import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  recentActivity: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalUsers: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get user's posts count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user?.id);

        // Get total users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get recent posts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: recentCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user?.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        setStats({
          totalPosts: postsCount || 0,
          totalUsers: usersCount || 0,
          recentActivity: recentCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las estadísticas",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, toast]);

  const createNewPost = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user?.id,
          title: 'Nuevo Post',
          content: 'Contenido del post...',
          status: 'draft',
        });

      if (error) throw error;

      toast({
        title: "Post creado",
        description: "Se ha creado un nuevo post en borrador",
      });

      // Refresh stats
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts + 1,
      }));
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el post",
      });
    }
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido de vuelta! Aquí está un resumen de tu actividad.
          </p>
        </div>
        <Button onClick={createNewPost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Post
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mis Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Total de posts creados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Total
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actividad Reciente
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Posts en los últimos 7 días
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Vista General</CardTitle>
            <CardDescription>
              Resumen de tu actividad en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Has creado <span className="font-semibold text-foreground">{stats.totalPosts} posts</span> hasta ahora.
            </div>
            <div className="text-sm text-muted-foreground">
              La plataforma tiene <span className="font-semibold text-foreground">{stats.totalUsers} usuarios</span> registrados.
            </div>
            <div className="text-sm text-muted-foreground">
              Has estado activo con <span className="font-semibold text-foreground">{stats.recentActivity} posts</span> en la última semana.
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas comunes que puedes realizar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={createNewPost}>
              <Plus className="h-4 w-4 mr-2" />
              Crear nuevo post
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Ver mis posts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Ver perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;