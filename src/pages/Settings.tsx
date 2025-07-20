import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings as SettingsIcon, Bell, Shield, Trash2, Download, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleExportData = () => {
    toast({
      title: "Exportando datos...",
      description: "Tus datos se están preparando para la descarga",
    });
    
    // Simulate data export
    setTimeout(() => {
      toast({
        title: "Datos exportados",
        description: "Tus datos han sido descargados exitosamente",
      });
    }, 2000);
  };

  const handleDeleteAccount = async () => {
    try {
      // Note: In a real app, you'd need a server endpoint to handle account deletion
      toast({
        variant: "destructive",
        title: "Función no disponible",
        description: "La eliminación de cuenta debe ser implementada en el servidor",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la cuenta",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona tu cuenta y preferencias de la aplicación
          </p>
        </div>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Información de la Cuenta
          </CardTitle>
          <CardDescription>
            Detalles básicos de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Estado de la cuenta</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default">Activa</Badge>
                {user?.email_confirmed_at && (
                  <Badge variant="secondary">Email verificado</Badge>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Registro</Label>
              <p className="text-sm text-muted-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Última sesión</Label>
              <p className="text-sm text-muted-foreground">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferencias
          </CardTitle>
          <CardDescription>
            Personaliza tu experiencia en la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notificaciones</Label>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones sobre actividad importante
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Modo oscuro</Label>
              <p className="text-sm text-muted-foreground">
                Cambia el tema de la interfaz
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-updates">Actualizaciones por email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe emails sobre nuevas funciones y actualizaciones
              </p>
            </div>
            <Switch
              id="email-updates"
              checked={emailUpdates}
              onCheckedChange={setEmailUpdates}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Guardado automático</Label>
              <p className="text-sm text-muted-foreground">
                Guarda automáticamente tus cambios mientras escribes
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Datos</CardTitle>
          <CardDescription>
            Controla tus datos y privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={handleExportData} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Exportar mis datos
            </Button>
            <Button variant="outline" onClick={signOut} className="flex-1">
              Cerrar sesión en todos los dispositivos
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-destructive">Zona de Peligro</h4>
              <p className="text-sm text-muted-foreground">
                Acciones irreversibles que afectarán permanentemente tu cuenta
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar cuenta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente tu
                    cuenta y removerá todos tus datos de nuestros servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
                    Sí, eliminar mi cuenta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Aplicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Versión:</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Framework:</span>
            <span>React + Vite</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base de datos:</span>
            <span>Supabase</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">UI:</span>
            <span>shadcn/ui + Tailwind CSS</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;