# Result art assets

Place final-result character images in this folder by major and profile type.

The result page resolves images with this URL pattern:

```text
/art/result/{majorId}/{typeKey}.png
```

Supported majors:

- `computer`
- `medicine`
- `business`

Supported profile types:

- `study`
- `practice`
- `social`
- `health`
- `pressure`

Expected files:

```text
art/result/computer/study.png
art/result/computer/practice.png
art/result/computer/social.png
art/result/computer/health.png
art/result/computer/pressure.png

art/result/medicine/study.png
art/result/medicine/practice.png
art/result/medicine/social.png
art/result/medicine/health.png
art/result/medicine/pressure.png

art/result/business/study.png
art/result/business/practice.png
art/result/business/social.png
art/result/business/health.png
art/result/business/pressure.png
```

If a file is missing, the page shows a placeholder with the expected image path.
