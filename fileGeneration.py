from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

# PDF Generation
def generate_pdf():
    file_path = "dataform-project-documentation-v1.pdf"
    doc = SimpleDocTemplate(file_path, pagesize=LETTER)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = styles['Title']
    heading_style = styles['Heading2']
    body_style = styles['Normal']
    code_style = ParagraphStyle('Code', parent=styles['Normal'], fontName='Courier', fontSize=9, leftIndent=20)

    content = []

    # Title Page
    content.append(Paragraph("Dataform Project Documentation", title_style))
    content.append(Paragraph("A Metadata-Driven Versioned Architecture", body_style))
    content.append(Spacer(1, 24))

    # Architecture Overview
    content.append(Paragraph("1. Architecture Overview", heading_style))
    content.append(Paragraph(
        "This project implements a decoupled architecture where the Raw Layer (Physical Tables) "
        "is separated from the Consumption Layer (Logical Views). This allows for schema evolution "
        "and versioning without breaking downstream reports.", body_style))
    content.append(Spacer(1, 12))

    # Logic Explanation
    content.append(Paragraph("2. Versioning Logic (since/until)", heading_style))
    content.append(Paragraph(
        "Each column in the metadata has a 'since' and 'until' tag. The system automatically "
        "filters these columns based on the target version being built.", body_style))
    
    data = [
        ['Property', 'Description'],
        ['name', 'The Logical name shown to the user.'],
        ['physicalName', 'The actual column name in BigQuery.'],
        ['since', 'The version number where this column starts.'],
        ['until', 'The version number where this column is deprecated.'],
    ]
    t = Table(data, colWidths=[1.5*72, 3.5*72])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    content.append(t)
    content.append(Spacer(1, 18))

    # Environment Safety
    content.append(Paragraph("3. Environment Isolation", heading_style))
    content.append(Paragraph(
        "Using the 'env' variable, datasets are prefixed (e.g., dev_raw_layer). "
        "The cleanup script is hard-coded to block execution if the environment is 'prod'.", body_style))
    content.append(Spacer(1, 12))

    # Commands
    content.append(Paragraph("4. Command Reference", heading_style))
    commands = [
        "dataform run --tags raw - Updates BigQuery table structures.",
        "dataform run --tags stable - Updates current production views.",
        "dataform run --tags v1 - Updates legacy version 1 views.",
        "dataform run --tags cleanup - Wipes the dev environment."
    ]
    for cmd in commands:
        content.append(Paragraph(f"• {cmd}", body_style))

    doc.build(content)
    return file_path

# README Generation
def generate_readme():
    content = """# Dataform Versioning Project

This project uses a metadata-driven approach to manage BigQuery datasets.

## Project Structure
- `/includes/metadata.js`: Define your tables and columns here.
- `/includes/factory.js`: Logic for versioning and aliasing.
- `/definitions/01_raw_layer.js`: Physical BigQuery tables.
- `/definitions/02_consumption_versions.js`: Versioned datasets (v1, v2).
- `/definitions/03_consumption_stable.js`: Production views.
- `/definitions/99_cleanup.js`: Safety-guarded deletion script.

## How to execute
1. Set your `env` in `workflow_settings.yaml`.
2. Run `dataform run --tags raw` to update schemas.
3. Run `dataform run --tags stable` to update views.

## Safety
The cleanup script will NOT run if `env` is set to `prod`.
"""
    with open("README.md", "w") as f:
        f.write(content)
    return "README.md"

generate_pdf()
generate_readme()