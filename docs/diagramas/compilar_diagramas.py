import os
import subprocess
import sys

diagrams_dir = os.path.dirname(os.path.abspath(__file__))
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

env = os.environ.copy()
env["PUPPETEER_EXECUTABLE_PATH"] = edge_path
env["PUPPETEER_SKIP_CHROMIUM_DOWNLOAD"] = "true"

files = [f for f in os.listdir(diagrams_dir) if f.endswith(".mmd")]
files.sort()

print(f"Compilando {len(files)} diagramas...")

success_count = 0
for mmd_file in files:
    base_name = os.path.splitext(mmd_file)[0]
    input_path = os.path.join(diagrams_dir, mmd_file)
    png_path = os.path.join(diagrams_dir, f"{base_name}.png")
    svg_path = os.path.join(diagrams_dir, f"{base_name}.svg")

    print(f"Compilando: {mmd_file} -> PNG & SVG")

    # Generar PNG (escala 2, fondo blanco)
    cmd_png = [
        "npx.cmd",
        "-y",
        "@mermaid-js/mermaid-cli@10.8.0",
        "-i", input_path,
        "-o", png_path,
        "-s", "2",
        "-b", "white"
    ]
    res_png = subprocess.run(cmd_png, env=env, capture_output=True, text=True)
    if res_png.returncode != 0:
        print(f"Error generando PNG para {mmd_file}:\n{res_png.stderr}\n{res_png.stdout}")
        continue

    # Generar SVG (vectorial de alta definicion)
    cmd_svg = [
        "npx.cmd",
        "-y",
        "@mermaid-js/mermaid-cli@10.8.0",
        "-i", input_path,
        "-o", svg_path,
        "-b", "white"
    ]
    res_svg = subprocess.run(cmd_svg, env=env, capture_output=True, text=True)
    if res_svg.returncode != 0:
        print(f"Error generando SVG para {mmd_file}:\n{res_svg.stderr}\n{res_svg.stdout}")
        continue

    print(f"[OK] {base_name}: PNG ({os.path.getsize(png_path)} bytes), SVG ({os.path.getsize(svg_path)} bytes)")
    success_count += 1

print(f"\nFinalizado: {success_count}/{len(files)} diagramas compilados exitosamente.")
if success_count != len(files):
    sys.exit(1)
