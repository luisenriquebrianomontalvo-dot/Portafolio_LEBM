import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Header banner
        self.setStrokeColor(colors.HexColor('#0071e3'))
        self.setLineWidth(1)
        self.line(40, 755, 572, 755)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor('#86868b'))
        self.drawString(40, 762, "PORTAFOLIO GLASSMORPHISM APPLE iOS — GUÍA DE PERSONALIZACIÓN")
        
        # Footer
        self.setStrokeColor(colors.HexColor('#e5e5ea'))
        self.line(40, 45, 572, 45)
        self.drawString(40, 32, "Documentación Oficial · Portafolio Glassmorphism")
        self.drawRightString(572, 32, f"Página {self._pageNumber} de {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom Apple-inspired Palette & Styles
    PRIMARY = colors.HexColor('#0071e3')
    DARK = colors.HexColor('#1d1d1f')
    GRAY = colors.HexColor('#515154')
    LIGHT_BG = colors.HexColor('#f5f5f7')
    BORDER_COLOR = colors.HexColor('#d2d2d7')
    ACCENT_GREEN = colors.HexColor('#34c759')
    ACCENT_PURPLE = colors.HexColor('#af52de')

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=DARK,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=DARK,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=DARK,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1a1a1a')
    )

    callout_style = ParagraphStyle(
        'Callout_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#00438a')
    )

    elements = []

    # Title & Badge
    elements.append(Paragraph("Manual de Edición y Personalización", title_style))
    elements.append(Paragraph("Plantilla de Portafolio Glassmorphism · Estilo Apple iOS & VisionOS", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=14))

    # Intro Card Table
    intro_html = (
        "<b>¡Bienvenido a tu nuevo portafolio!</b><br/>"
        "Esta guía paso a paso te explica de manera clara y sencilla cómo personalizar cada sección del portafolio: "
        "modificar textos en español e inglés, subir tu foto de perfil, agregar imágenes a tus proyectos, "
        "configurar tus habilidades técnicas, experiencia laboral, certificaciones, enlaces a redes sociales y tu archivo de CV."
    )
    intro_table = Table([[Paragraph(intro_html, body_style)]], colWidths=[532])
    intro_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(intro_table)
    elements.append(Spacer(1, 12))

    # Section 1: Estructura del Proyecto
    elements.append(Paragraph("1. Dónde se encuentra cada archivo", h1_style))
    elements.append(Paragraph(
        "Todos los archivos editables están organizados en la carpeta <code>src/app/</code>. A continuación tienes la referencia rápida de qué archivo controla cada parte:",
        body_style
    ))

    files_data = [
        ["Elemento a Personalizar", "Ruta del Archivo a Modificar"],
        ["Textos Generales, Traducciones y Contacto", "src/app/services/translate.service.ts"],
        ["Hero (Encabezado principal, Olas 3D, Botones)", "src/app/components/hero/hero.component.html"],
        ["Stack Tecnológico (Habilidades)", "src/app/components/skills/skills.component.ts"],
        ["Proyectos Destacados (Títulos, links, tags)", "src/app/components/projects/projects.component.ts"],
        ["Experiencia Laboral (Empresas, roles, fechas)", "src/app/components/experience/experience.component.ts"],
        ["Certificaciones y Educación", "src/app/components/certifications/certifications.component.ts"],
        ["Colores, Sombras y Estilos Globales", "src/styles.scss"],
        ["Imágenes de Proyectos y Perfil", "src/assets/images/"],
        ["Archivo PDF de tu Currículum", "src/assets/cv/"]
    ]

    t_files = Table([[Paragraph(f"<b>{c}</b>" if i==0 else c, code_style if j==1 and i>0 else body_style) for j, c in enumerate(row)] for i, row in enumerate(files_data)], colWidths=[232, 300])
    t_files.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e8f2fc')),
        ('TEXTCOLOR', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(t_files)
    elements.append(Spacer(1, 14))

    # Section 2: Traducciones y Textos
    elements.append(Paragraph("2. Cómo Editar Textos y Traducciones (Español e Inglés)", h1_style))
    elements.append(Paragraph(
        "El portafolio incluye soporte multi-idioma (ES / EN). Para cambiar tu nombre, rol, biografía y textos de contacto, abre el archivo:",
        body_style
    ))
    elements.append(Paragraph("📁 <b>src/app/services/translate.service.ts</b>", h2_style))
    elements.append(Paragraph(
        "Dentro encontrarás el objeto <code>translations</code> con dos secciones: <code>es: { ... }</code> y <code>en: { ... }</code>. "
        "Simplemente reemplaza los valores que están entre comillas:",
        body_style
    ))

    code_snippet1 = (
        "es: {<br/>"
        "&nbsp;&nbsp;'hero.name': '<b>Tu Nombre y Apellido</b>',<br/>"
        "&nbsp;&nbsp;'hero.title': '<b>Ingeniero de Software / Full Stack Developer</b>',<br/>"
        "&nbsp;&nbsp;'hero.subtitle': '<b>Frontend · Backend · Cloud · UI/UX</b>',<br/>"
        "&nbsp;&nbsp;'hero.location': '<b>Madrid, España (o tu ciudad)</b>',<br/>"
        "&nbsp;&nbsp;'about.description': '<b>Tu biografía profesional aquí...</b>',<br/>"
        "&nbsp;&nbsp;'contact.emailValue': '<b>micorreo@gmail.com</b>',<br/>"
        "&nbsp;&nbsp;'contact.linkedinValue': '<b>/in/tu-perfil-linkedin</b>',<br/>"
        "&nbsp;&nbsp;'contact.githubValue': '<b>@tu-usuario-github</b>'<br/>"
        "}"
    )
    t_code1 = Table([[Paragraph(code_snippet1, code_style)]], colWidths=[532])
    t_code1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_code1)
    elements.append(Paragraph("<i>* Recuerda actualizar también la sección 'en: { ... }' para que el cambio de idioma muestre tu información en inglés.</i>", callout_style))
    elements.append(Spacer(1, 14))

    # Section 3: Foto de Perfil
    elements.append(Paragraph("3. Cómo Subir y Activar tu Foto de Perfil", h1_style))
    elements.append(Paragraph(
        "Para mostrar tu fotografía en la tarjeta flotante del Hero:",
        body_style
    ))
    elements.append(Paragraph("<b>Paso 1:</b> Guarda tu fotografía en formato PNG o JPG dentro de la carpeta:", body_style))
    elements.append(Paragraph("📁 <b>src/assets/images/profile.png</b>", code_style))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("<b>Paso 2:</b> Abre <b>src/app/components/hero/hero.component.html</b> y dentro de <code>&lt;div class=\"avatar-img-container\"&gt;</code> añade la etiqueta de imagen:", body_style))

    code_snippet_avatar = (
        "&lt;div class=\"avatar-img-container\"&gt;<br/>"
        "&nbsp;&nbsp;&lt;img src=\"/assets/images/profile.png\" alt=\"Foto de Perfil\" class=\"avatar-photo\"&gt;<br/>"
        "&lt;/div&gt;"
    )
    t_code_avatar = Table([[Paragraph(code_snippet_avatar, code_style)]], colWidths=[532])
    t_code_avatar.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_code_avatar)
    elements.append(Paragraph("<i>Consejo: Una foto cuadrada o con proporción 1:1 en alta resolución (500x500 px o superior) luce espectacular con el cristal esmerilado.</i>", callout_style))

    elements.append(PageBreak())

    # Section 4: Proyectos e Imágenes
    elements.append(Paragraph("4. Cómo Agregar Proyectos y Subir sus Capturas", h1_style))
    elements.append(Paragraph(
        "Cada proyecto tiene su título, descripción en ambos idiomas, etiquetas de tecnología, enlace en vivo, código en GitHub e imagen de portada.",
        body_style
    ))
    elements.append(Paragraph("<b>Paso 1: Subir las capturas de pantalla</b>", body_style))
    elements.append(Paragraph("Guarda las capturas en <b>src/assets/images/</b> (por ejemplo: <code>proyecto-1.png</code>, <code>ecommerce.jpg</code>). Recomendamos resolución 1920x1200 o proporción 16:10.", body_style))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("<b>Paso 2: Configurar los datos del proyecto</b>", body_style))
    elements.append(Paragraph("Abre 📁 <b>src/app/components/projects/projects.component.ts</b> y edita el arreglo <code>projects: Project[] = [ ... ]</code>:", body_style))

    code_snippet_proj = (
        "{<br/>"
        "&nbsp;&nbsp;id: 1,<br/>"
        "&nbsp;&nbsp;titleEs: '<b>Mi Aplicación E-Commerce</b>',<br/>"
        "&nbsp;&nbsp;titleEn: '<b>My E-Commerce Web App</b>',<br/>"
        "&nbsp;&nbsp;descriptionEs: '<b>Tienda online con pagos Stripe, carrito y panel de control.</b>',<br/>"
        "&nbsp;&nbsp;descriptionEn: '<b>Online shop with Stripe payments, cart and admin dashboard.</b>',<br/>"
        "&nbsp;&nbsp;image: '<b>/assets/images/proyecto-1.png</b>', // &lt;-- Ruta de tu imagen subida<br/>"
        "&nbsp;&nbsp;tags: ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL'],<br/>"
        "&nbsp;&nbsp;liveUrl: '<b>https://mi-proyecto-demo.vercel.app</b>',<br/>"
        "&nbsp;&nbsp;githubUrl: '<b>https://github.com/tu-usuario/mi-proyecto</b>',<br/>"
        "&nbsp;&nbsp;featured: true<br/>"
        "}"
    )
    t_code_proj = Table([[Paragraph(code_snippet_proj, code_style)]], colWidths=[532])
    t_code_proj.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_code_proj)
    elements.append(Spacer(1, 14))

    # Section 5: Habilidades
    elements.append(Paragraph("5. Cómo Personalizar tu Stack Tecnológico (Skills)", h1_style))
    elements.append(Paragraph(
        "Abre 📁 <b>src/app/components/skills/skills.component.ts</b>. Puedes agregar, eliminar o modificar tecnologías en el arreglo <code>allSkills</code>. "
        "Puedes usar iconos oficiales de <i>devicon.dev</i>:",
        body_style
    ))

    code_snippet_skills = (
        "{<br/>"
        "&nbsp;&nbsp;name: '<b>React</b>',<br/>"
        "&nbsp;&nbsp;icon: '<b>https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg</b>',<br/>"
        "&nbsp;&nbsp;category: '<b>frontend</b>' // Opciones: 'frontend', 'backend', 'databases', 'devops', 'tools'<br/>"
        "}"
    )
    t_code_skills = Table([[Paragraph(code_snippet_skills, code_style)]], colWidths=[532])
    t_code_skills.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_code_skills)
    elements.append(Spacer(1, 14))

    # Section 6: Experiencia Laboral
    elements.append(Paragraph("6. Cómo Editar tu Experiencia Laboral", h1_style))
    elements.append(Paragraph(
        "Abre 📁 <b>src/app/components/experience/experience.component.ts</b> y modifica el arreglo <code>jobs: Job[] = [ ... ]</code>:",
        body_style
    ))

    code_snippet_exp = (
        "{<br/>"
        "&nbsp;&nbsp;company: '<b>Nombre de la Empresa o Startup</b>',<br/>"
        "&nbsp;&nbsp;roleEs: '<b>Desarrollador Full Stack Senior</b>',<br/>"
        "&nbsp;&nbsp;roleEn: '<b>Senior Full Stack Developer</b>',<br/>"
        "&nbsp;&nbsp;periodEs: '<b>Ene 2023 — Actualidad</b>',<br/>"
        "&nbsp;&nbsp;periodEn: '<b>Jan 2023 — Present</b>',<br/>"
        "&nbsp;&nbsp;locationEs: '<b>Ciudad, País (o Remoto)</b>',<br/>"
        "&nbsp;&nbsp;locationEn: '<b>City, Country (or Remote)</b>',<br/>"
        "&nbsp;&nbsp;current: true, // Pone el nodo en color verde luminoso de 'puesto actual'<br/>"
        "&nbsp;&nbsp;bulletsEs: [<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;'Logro o responsabilidad principal destacada.',<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;'Tecnologías implementadas y optimizaciones logradas.'<br/>"
        "&nbsp;&nbsp;],<br/>"
        "&nbsp;&nbsp;tags: ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL']<br/>"
        "}"
    )
    t_code_exp = Table([[Paragraph(code_snippet_exp, code_style)]], colWidths=[532])
    t_code_exp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_code_exp)

    elements.append(PageBreak())

    # Section 7: Certificaciones
    elements.append(Paragraph("7. Cómo Editar Certificaciones y Educación", h1_style))
    elements.append(Paragraph(
        "Abre 📁 <b>src/app/components/certifications/certifications.component.ts</b> y modifica el arreglo <code>certifications: Certification[] = [ ... ]</code>:",
        body_style
    ))

    code_snippet_cert = (
        "{<br/>"
        "&nbsp;&nbsp;name: '<b>AWS Certified Solutions Architect</b>',<br/>"
        "&nbsp;&nbsp;issuer: '<b>Amazon Web Services</b>',<br/>"
        "&nbsp;&nbsp;date: '<b>2024</b>',<br/>"
        "&nbsp;&nbsp;url: '<b>https://link-de-verificacion-credencial.com</b>',<br/>"
        "&nbsp;&nbsp;icon: '☁️',<br/>"
        "&nbsp;&nbsp;color: 'var(--accent-blue)'<br/>"
        "}"
    )
    t_code_cert = Table([[Paragraph(code_snippet_cert, code_style)]], colWidths=[532])
    t_code_cert.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_code_cert)
    elements.append(Spacer(1, 14))

    # Section 8: Subir tu CV
    elements.append(Paragraph("8. Cómo Habilitar la Descarga de tu Archivo de CV", h1_style))
    elements.append(Paragraph(
        "Si deseas que el botón del Hero descargue tu currículum en PDF:",
        body_style
    ))
    elements.append(Paragraph("<b>1.</b> Guarda tu archivo PDF en: 📁 <b>src/assets/cv/mi-curriculum.pdf</b>", body_style))
    elements.append(Paragraph("<b>2.</b> Abre <b>src/app/components/hero/hero.component.html</b> y cambia el botón de descarga a un enlace <code>&lt;a&gt;</code>:", body_style))

    code_snippet_cv = (
        "&lt;a href=\"/assets/cv/mi-curriculum.pdf\" download=\"Mi-CV.pdf\" class=\"btn btn-primary\"&gt;<br/>"
        "&nbsp;&nbsp;&lt;svg ... &gt;&lt;/svg&gt;<br/>"
        "&nbsp;&nbsp;&lt;span&gt;{{ t('hero.download') }}&lt;/span&gt;<br/>"
        "&lt;/a&gt;"
    )
    t_code_cv = Table([[Paragraph(code_snippet_cv, code_style)]], colWidths=[532])
    t_code_cv.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(t_code_cv)
    elements.append(Spacer(1, 14))

    # Section 9: Comandos útiles
    elements.append(Paragraph("9. Comandos para Probar y Desplegar tu Portafolio", h1_style))
    elements.append(Paragraph("Ejecuta estos comandos desde la terminal dentro de la carpeta del proyecto:", body_style))

    cmd_data = [
        ["Comando", "Descripción"],
        ["npm start", "Inicia el servidor local de desarrollo en http://localhost:4200/ con recarga en vivo."],
        ["npm run build", "Compila la versión optimizada de producción en la carpeta dist/."],
        ["git add . ; git commit -m 'Mis cambios'", "Guarda tus modificaciones en el repositorio local."],
        ["git push origin main", "Sube tus cambios a GitHub para despliegue en Vercel, Netlify o GitHub Pages."]
    ]

    t_cmd = Table([[Paragraph(f"<b>{c}</b>" if i==0 else c, code_style if j==0 and i>0 else body_style) for j, c in enumerate(row)] for i, row in enumerate(cmd_data)], colWidths=[200, 332])
    t_cmd.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e8f2fc')),
        ('TEXTCOLOR', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(t_cmd)
    elements.append(Spacer(1, 18))

    # Final Footer Card
    footer_card = Table([[Paragraph("<b>✨ ¡Listo!</b> Con estos sencillos pasos tendrás un portafolio ultra-moderno con estética Apple iOS Glassmorphism completamente adaptado a tu perfil profesional.", callout_style)]], colWidths=[532])
    footer_card.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eef6ff')),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(footer_card)

    doc.build(elements, canvasmaker=NumberedCanvas)
    print(f"PDF successfully created at: {filename}")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'GUIA_EDICION_PORTAFOLIO.pdf'
    build_pdf(target)
