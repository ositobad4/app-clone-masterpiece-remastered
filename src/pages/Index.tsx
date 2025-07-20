import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Shield, Globe, Rocket, Star, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Súper Rápido",
      description: "Construido con Vite y React para un rendimiento excepcional"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Seguro",
      description: "Autenticación robusta con Supabase y políticas RLS"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Moderno",
      description: "Interfaz hermosa con shadcn/ui y Tailwind CSS"
    },
    {
      icon: <Rocket className="h-8 w-8 text-purple-500" />,
      title: "Escalable",
      description: "Base de datos PostgreSQL con funcionalidades en tiempo real"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm">
            ✨ Nuevo y Mejorado
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            MasterApp Remastered
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una aplicación web completa con autenticación, dashboard interactivo, gestión de perfiles y mucho más.
            Construida con las mejores tecnologías modernas.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/dashboard">
                  Ver Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-lg px-8">
                <Link to="/profile">Ver Perfil</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/auth">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-lg px-8">
                <Link to="/auth">Iniciar Sesión</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Características Increíbles</h2>
          <p className="text-muted-foreground text-lg">
            Todo lo que necesitas para construir aplicaciones web modernas
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 rounded-lg p-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-muted-foreground">TypeScript</div>
          </div>
          <div>
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold">∞</div>
            <div className="text-muted-foreground">Usuarios</div>
          </div>
          <div>
            <div className="flex justify-center mb-2">
              <Rocket className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-muted-foreground">Disponibilidad</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center space-y-6 bg-primary/5 rounded-lg p-8">
          <h2 className="text-3xl font-bold">¿Listo para comenzar?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Únete a nuestra plataforma y descubre todas las funcionalidades que tenemos para ti.
            Registro gratuito y acceso inmediato.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/auth">
              Crear Cuenta Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>
      )}
    </div>
  );
};

export default Index;
