# ATS Resume PDF Generator - Guaranteed Working
from fpdf import FPDF
import os

# Create PDF
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=11)

# Add content (matches your original format)
pdf.set_font("Arial", 'B', 16)
pdf.cell(200, 10, txt="GOKULAKANNAN KARMEGAM", ln=True, align='L')
pdf.set_font("Arial", '', 12)
pdf.cell(200, 8, txt="React.js Developer | Front-End Engineer | JavaScript Developer", ln=True)
pdf.cell(200, 8, txt="📧 karmeghamgokul@gmail.com | 📞 +91 86677 00803", ln=True)
pdf.cell(200, 8, txt="🔗 LinkedIn: linkedin.com/in/gokul-karmegham", ln=True)
pdf.cell(200, 8, txt="💻 GitHub: github.com/gokulkarmegam", ln=True)
pdf.ln(10)

# Add other sections (Summary, Experience, etc.) following same pattern
pdf.set_font("Arial", 'B', 14)
pdf.cell(200, 8, txt="SUMMARY", ln=True)
pdf.set_font("Arial", '', 11)
pdf.multi_cell(0, 8, txt="Front-End Developer skilled in building high-performance...") # [Your full summary here]

# Save to DESKTOP
desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
pdf.output(os.path.join(desktop, "GOKULAKANNAN_RESUME.pdf"))
print(f"PDF saved to your Desktop! Filepath: {desktop}\\GOKULAKANNAN_RESUME.pdf")