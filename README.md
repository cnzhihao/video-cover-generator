# Video Cover Generator

A pure frontend video cover generator for producing multi-ratio cover images.

Online: https://video-cover-generator.fhxqtech.com/

The V1 product requirements are documented in:

- [PRD: Multi-Ratio Video Cover Generator V1](docs/prd-video-cover-generator-v1.md)

## Output Ratios

- 16:9
- 4:3
- 3:4

## Local Usage

Open `index.html` directly in a browser, or serve the directory with any static file server:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Deployment

Cloudflare Workers static assets:

```bash
npm run deploy
```

## License

MIT
