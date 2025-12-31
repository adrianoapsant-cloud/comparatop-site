"""
Image SEO Optimizer - ComparaTop
================================
Script para otimizar imagens de produtos para SEO.

USO:
1. Coloque as imagens brutas em: tools/input_images/{produto}/
2. Execute: python tools/image_seo_optimizer.py {produto} {marca} {modelo}
3. O script vai:
   - Analisar cada imagem
   - Renomear com nomes SEO-friendly
   - Mover para dist/assets/images/products/{categoria}/{produto}/
   - Gerar o JSON de imagens para o produto
   - Gerar alt text para cada imagem

EXEMPLO:
python tools/image_seo_optimizer.py brm44hb brastemp "BRM44HB 375L"
"""

import os
import sys
import json
import shutil
from pathlib import Path

# Mapeamento de tipos de imagem baseado em análise visual
# (Este mapeamento será preenchido manualmente após análise)
IMAGE_TYPES = {
    "frontal": "visao-frontal-fechada",
    "aberta": "porta-aberta-interior",
    "freezer": "freezer-congelador-detalhe",
    "prateleiras": "prateleiras-organizacao-interna",
    "gaveta": "gaveta-legumes-verduras",
    "porta": "porta-compartimentos-garrafas",
    "painel": "painel-controle-display",
    "dimensoes": "dimensoes-medidas",
    "lateral": "visao-lateral",
    "traseira": "visao-traseira",
    "detalhe": "detalhe-acabamento",
    "selo": "selo-procel-eficiencia",
}

def generate_alt_text(image_type, marca, modelo, categoria="geladeira"):
    """Gera alt text descritivo para SEO"""
    alt_texts = {
        "frontal": f"{marca} {modelo} - Visão frontal da {categoria} fechada em fundo branco",
        "aberta": f"{marca} {modelo} - Interior da {categoria} com porta aberta mostrando prateleiras",
        "freezer": f"{marca} {modelo} - Detalhe do freezer/congelador com gavetas",
        "prateleiras": f"{marca} {modelo} - Prateleiras de vidro organizadas no interior",
        "gaveta": f"{marca} {modelo} - Gaveta para legumes e verduras Fresh Zone",
        "porta": f"{marca} {modelo} - Compartimentos na porta para garrafas e condimentos",
        "painel": f"{marca} {modelo} - Painel de controle digital de temperatura",
        "dimensoes": f"{marca} {modelo} - Diagrama com dimensões e medidas",
        "lateral": f"{marca} {modelo} - Visão lateral mostrando profundidade",
        "traseira": f"{marca} {modelo} - Visão traseira com motor e conexões",
        "detalhe": f"{marca} {modelo} - Detalhe do acabamento e design",
        "selo": f"{marca} {modelo} - Selo Procel de eficiência energética",
    }
    return alt_texts.get(image_type, f"{marca} {modelo} - Imagem do produto")

def generate_seo_filename(marca, modelo_slug, image_type, index, categoria="geladeira"):
    """Gera nome de arquivo otimizado para SEO"""
    type_suffix = IMAGE_TYPES.get(image_type, "imagem")
    return f"{marca.lower()}-{modelo_slug}-{categoria}-{type_suffix}-{index:02d}.jpg"

def create_image_manifest(images_data, output_path):
    """Cria arquivo JSON com dados das imagens para uso no build"""
    manifest = {
        "images": images_data,
        "generated_at": "auto",
        "version": "1.0"
    }
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"[OK] Manifesto criado: {output_path}")

def process_images(produto_slug, marca, modelo, categoria="geladeira"):
    """
    Processa imagens de um produto.
    
    Args:
        produto_slug: ex: "brm44hb"
        marca: ex: "Brastemp"
        modelo: ex: "BRM44HB 375L"
        categoria: ex: "geladeira"
    """
    input_dir = Path(f"tools/input_images/{produto_slug}")
    output_dir = Path(f"dist/assets/images/products/{categoria}/{produto_slug}")
    
    if not input_dir.exists():
        print(f"[ERRO] Pasta de entrada nao encontrada: {input_dir}")
        print(f"   Crie a pasta e coloque as imagens la.")
        return
    
    # Criar pasta de saída
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Listar imagens
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    images = [f for f in input_dir.iterdir() if f.suffix.lower() in image_extensions]
    
    if not images:
        print(f"[ERRO] Nenhuma imagem encontrada em: {input_dir}")
        return
    
    print(f"\n[INFO] Encontradas {len(images)} imagens para processar")
    print(f"   Marca: {marca}")
    print(f"   Modelo: {modelo}")
    print(f"   Categoria: {categoria}")
    print("-" * 50)
    
    # Arquivo de mapeamento para preenchimento manual
    mapping_file = input_dir / "image_mapping.json"
    
    if mapping_file.exists():
        with open(mapping_file, 'r', encoding='utf-8') as f:
            mapping = json.load(f)
    else:
        # Criar template de mapeamento
        mapping = {}
        for img in sorted(images):
            mapping[img.name] = {
                "type": "frontal",  # Preencher manualmente após ver a imagem
                "description": ""   # Descrição adicional opcional
            }
        
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(mapping, f, ensure_ascii=False, indent=2)
        
        print(f"[AVISO] Arquivo de mapeamento criado: {mapping_file}")
        print(f"   Edite o arquivo para definir o tipo de cada imagem:")
        print(f"   Tipos disponíveis: {list(IMAGE_TYPES.keys())}")
        print(f"\n   Depois execute o script novamente.")
        return
    
    # Processar imagens com mapeamento
    images_data = []
    modelo_slug = produto_slug
    
    for idx, img in enumerate(sorted(images), 1):
        if img.name not in mapping:
            print(f"[AVISO] Imagem nao mapeada: {img.name}")
            continue
        
        img_info = mapping[img.name]
        img_type = img_info.get("type", "frontal")
        
        # Gerar novo nome
        new_filename = generate_seo_filename(marca, modelo_slug, img_type, idx, categoria)
        
        # Gerar alt text
        alt_text = generate_alt_text(img_type, marca, modelo, categoria)
        if img_info.get("description"):
            alt_text = img_info["description"]
        
        # Copiar arquivo
        src = img
        dst = output_dir / new_filename
        shutil.copy2(src, dst)
        
        print(f"[OK] {img.name} -> {new_filename}")
        
        images_data.append({
            "original": img.name,
            "filename": new_filename,
            "path": f"/assets/images/products/{categoria}/{produto_slug}/{new_filename}",
            "type": img_type,
            "alt": alt_text,
            "index": idx
        })
    
    # Criar manifesto
    manifest_path = output_dir / "images.json"
    create_image_manifest(images_data, manifest_path)
    
    print("-" * 50)
    print(f"[SUCESSO] Processamento concluido! {len(images_data)} imagens otimizadas.")
    print(f"   Arquivos salvos em: {output_dir}")
    
    # Gerar snippet para JSON do produto
    print("\n[SNIPPET] Para adicionar ao JSON do produto:")
    print("-" * 50)
    snippet = {
        "images": [img["path"] for img in images_data],
        "image_alts": {img["path"]: img["alt"] for img in images_data}
    }
    print(json.dumps(snippet, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("USO: python image_seo_optimizer.py <produto_slug> <marca> <modelo>")
        print("EXEMPLO: python image_seo_optimizer.py brm44hb Brastemp 'BRM44HB 375L'")
        sys.exit(1)
    
    produto = sys.argv[1]
    marca = sys.argv[2]
    modelo = sys.argv[3]
    categoria = sys.argv[4] if len(sys.argv) > 4 else "geladeira"
    
    process_images(produto, marca, modelo, categoria)
