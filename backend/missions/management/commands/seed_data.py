from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from missions.models import Mission
import random

class Command(BaseCommand):
    help = 'Genera 10 pilotos y 10 misiones aleatorias de prueba'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Iniciando simulador de vuelo... 🚁'))

        # Listas de datos falsos para que quede un feed chulo
        nombres = ['Maverick', 'Iceman', 'Viper', 'Goose', 'Jester', 'Charlie', 'Merlin', 'Cougar', 'Wolfman', 'Slider']
        drones = ['DJI Mini 3', 'Mavic 3 Pro', 'FPV Avata', 'Inspire 3', 'Autel EVO']
        titulos_mision = [
            'Inspección de puente colapsado', 'Grabación de boda en la playa', 
            'Vuelo nocturno por la ciudad', 'Seguimiento de coche de rally', 
            'Revisión de paneles solares', 'Fotogrametría de un castillo',
            'Vuelo rasante en el bosque', 'Prueba de velocidad FPV',
            'Patrulla costera al atardecer', 'Rescate en la montaña'
        ]

        # 1. Crear 10 Pilotos
        pilotos_creados = []
        for i in range(10):
            # Nos aseguramos de que el username sea único
            username = f"{nombres[i]}_{random.randint(10, 99)}"
            
            # Si el usuario ya existe, lo saltamos para no dar error
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    password='password123',
                    email=f"{username}@skytrack.com"
                )
                # ¡MAGIA! Gracias a tu Signal, el Profile ya se ha creado.
                # Solo tenemos que actualizarle el dron y la experiencia.
                user.profile.favorite_drone = random.choice(drones)
                user.profile.experience_level = random.choice(['begginer', 'pro'])
                user.profile.save()
                
                pilotos_creados.append(user)

        self.stdout.write(self.style.SUCCESS(f'✅ {len(pilotos_creados)} Pilotos reclutados.'))

        # 2. Crear 10 Misiones
        if pilotos_creados:
            for i in range(10):
                Mission.objects.create(
                    user=random.choice(pilotos_creados),
                    name=titulos_mision[i],
                    # Opcional: Si tienes descripción, latitud o longitud en tu modelo, puedes añadir textos o números random aquí
                )
            self.stdout.write(self.style.SUCCESS('✅ 10 Misiones registradas en el radar.'))
        else:
            self.stdout.write(self.style.ERROR('❌ No se crearon pilotos nuevos. Borra la base de datos o cambia los nombres.'))

        self.stdout.write(self.style.SUCCESS('🎉 ¡Base de datos de SkyTrack lista para volar!'))