"""
Script to generate a sample Excel file with phone data.
Run once: python generate_sample_data.py
Requires: pip install openpyxl
"""
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Téléphones"

# Headers
headers = [
    "Marque", "Modèle", "Prix (€)", "Image URL",
    "Écran (pouces)", "Résolution", "Processeur",
    "RAM (Go)", "Stockage (Go)", "Batterie (mAh)",
    "Appareil Photo Principal (MP)", "Appareil Photo Frontal (MP)",
    "5G", "Poids (g)", "OS", "Couleurs Disponibles",
    "Note /10", "Indice Réparabilité /10"
]

header_fill = PatternFill(start_color="1a1a2e", end_color="1a1a2e", fill_type="solid")
header_font = Font(name="Calibri", bold=True, color="FFFFFF", size=12)
thin_border = Border(
    left=Side(style='thin'), right=Side(style='thin'),
    top=Side(style='thin'), bottom=Side(style='thin')
)

for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=header)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    cell.border = thin_border

# Phone data
phones = [
    ["Apple", "iPhone 16 Pro Max", 1479, "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=400&hei=400&fmt=png-alpha",
     "6.9", "2868x1320", "A18 Pro", 8, 256, 4685, 48, 12, "Oui", 227, "iOS 18", "Titane Naturel, Noir, Blanc, Sable", 9.2, 7.0],

    ["Apple", "iPhone 16", 969, "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=400&hei=400&fmt=png-alpha",
     "6.1", "2556x1179", "A18", 8, 128, 3561, 48, 12, "Oui", 170, "iOS 18", "Outremer, Sarcelle, Rose, Blanc, Noir", 8.5, 7.5],

    ["Samsung", "Galaxy S25 Ultra", 1459, "https://image-us.samsung.com/us/smartphones/galaxy-s25-ultra/images/galaxy-s25-ultra-highlights-design-titanium-silverblue-back-mo.jpg?imwidth=400",
     "6.9", "3120x1440", "Snapdragon 8 Elite", 12, 256, 5000, 200, 12, "Oui", 218, "Android 15 / One UI 7", "Bleu Titane, Noir, Gris, Argent", 9.3, 8.2],

    ["Samsung", "Galaxy S25", 899, "https://image-us.samsung.com/us/smartphones/galaxy-s25/images/galaxy-s25-highlights-design-icyblue-back-mo.jpg?imwidth=400",
     "6.2", "2340x1080", "Snapdragon 8 Elite", 12, 128, 4000, 50, 12, "Oui", 162, "Android 15 / One UI 7", "Bleu Glacé, Vert, Noir, Argent", 8.6, 8.0],

    ["Google", "Pixel 9 Pro", 1099, "https://lh3.googleusercontent.com/xg0MIvkMWfGczLP2G5_VxVVvnFGHSMPpJA8Ws7vEAftmVg82wUfHDif4Sq0tA3XjSPs3Z32VFceB1CgmNqMGBNOJYhHlRC5m_8E=s400",
     "6.3", "2856x1280", "Tensor G4", 16, 128, 4700, 50, 42, "Oui", 199, "Android 15", "Obsidienne, Porcelaine, Vert Sauge, Rose", 9.0, 8.5],

    ["Google", "Pixel 9", 899, "https://lh3.googleusercontent.com/fife/ALs6j0GFxWaLRtVQxGhFvPJHt4EI2gf8KhO0Dbm0RhXqGHvBe-B8Pns2MVPKRPLBX5FdX4z4cQ=s400",
     "6.3", "2424x1080", "Tensor G4", 12, 128, 4700, 50, 10.5, "Oui", 198, "Android 15", "Obsidienne, Porcelaine, Vert, Rose", 8.4, 8.5],

    ["Xiaomi", "14 Ultra", 1499, "https://i02.appmifile.com/46_operator_sg/27/02/2024/3e45511a2ddccbda9f489cdd8c498714.png?f=webp&w=400",
     "6.73", "3200x1440", "Snapdragon 8 Gen 3", 16, 512, 5000, 50, 32, "Oui", 224, "Android 14 / HyperOS", "Noir, Blanc", 9.1, 7.0],

    ["OnePlus", "13", 899, "https://image01.oneplus.net/ebp/202501/07/1-m00-6b-2a-cskhdmfhzqwadz1uaai18xdssra335.png?x-amz-process=image/format,webp/quality,Q_80/resize,w_400",
     "6.82", "3168x1440", "Snapdragon 8 Elite", 12, 256, 6000, 50, 32, "Oui", 213, "Android 15 / OxygenOS 15", "Noir Eclipse, Bleu Arctique", 8.8, 7.5],

    ["Samsung", "Galaxy Z Fold 6", 1799, "https://image-us.samsung.com/us/smartphones/galaxy-z-fold6/images/galaxy-z-fold6-highlights-design-silver-shadow-open-front-mo.jpg?imwidth=400",
     "7.6 (déplié)", "2160x1856", "Snapdragon 8 Gen 3", 12, 256, 4400, 50, 10, "Oui", 239, "Android 14 / One UI 6", "Argent, Rose, Bleu Marine", 8.7, 5.0],

    ["Apple", "iPhone 16 Pro", 1229, "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=400&hei=400&fmt=png-alpha",
     "6.3", "2622x1206", "A18 Pro", 8, 128, 3582, 48, 12, "Oui", 199, "iOS 18", "Titane Naturel, Noir, Blanc, Sable", 9.0, 7.0],

    ["Nothing", "Phone (2a)", 349, "https://nothing.tech/cdn/shop/files/phone-2a-black_400x400.png",
     "6.7", "2412x1084", "Dimensity 7200 Pro", 8, 128, 5000, 50, 32, "Oui", 190, "Android 14 / Nothing OS", "Noir, Blanc", 7.8, 8.0],

    ["Motorola", "Edge 50 Ultra", 899, "https://motorolain.vtexassets.com/arquivos/ids/157979/motorola-edge-50-ultra-pdp-render-Forest-Grey-1-nkkpfsr5.png?v=638542024752370000&width=400",
     "6.7", "2712x1220", "Snapdragon 8s Gen 3", 16, 512, 4500, 50, 50, "Oui", 197, "Android 14", "Gris Forêt, Bois de Pêche", 8.3, 7.0],
]

for row_idx, phone in enumerate(phones, 2):
    for col_idx, value in enumerate(phone, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=value)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.border = thin_border

# Adjust column widths
for col in range(1, len(headers) + 1):
    ws.column_dimensions[openpyxl.utils.get_column_letter(col)].width = 22

wb.save("phones_catalog.xlsx")
print("✓ phones_catalog.xlsx generated successfully!")
