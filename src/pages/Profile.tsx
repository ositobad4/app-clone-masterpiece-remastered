import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el perfil",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updatedProfile = {
        display_name: formData.get('displayName') as string,
        bio: formData.get('bio') as string,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el perfil",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
        <p className="text-muted-foreground">No se pudo cargar la información del perfil.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {profile.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>{profile.display_name || user?.email}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
              {profile.role}
            </Badge>
            <span>•</span>
            <span>Miembro desde {new Date(profile.created_at).getFullYear()}</span>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <CardDescription>
            Actualiza tu información personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nombre a mostrar</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={profile.display_name || ''}
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                El email no se puede cambiar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ''}
                placeholder="Cuéntanos sobre ti..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <div className="flex items-center gap-2">
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                  {profile.role}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  El rol es asignado por los administradores
                </p>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">ID de usuario:</span>
            <span className="text-sm font-mono">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Fecha de registro:</span>
            <span className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Última actualización:</span>
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;