$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'

$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $rect,
  [System.Drawing.Color]::FromArgb(255, 11, 16, 32),
  [System.Drawing.Color]::FromArgb(255, 27, 42, 107),
  45
)
$g.FillRectangle($bg, $rect)

$ticketBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 243, 232))
$g.FillRectangle($ticketBrush, 80, 90, 1040, 450)

$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), 3)
$g.DrawRectangle($pen, 80, 90, 1040, 450)

$dark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 11, 16, 32))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 11, 16, 32))

$font1 = New-Object System.Drawing.Font('Segoe UI', 58, [System.Drawing.FontStyle]::Bold)
$font2 = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular)
$font3 = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold)
$font4 = New-Object System.Drawing.Font('Consolas', 18, [System.Drawing.FontStyle]::Regular)

$g.DrawString('BASE LUCKY LOTTO', $font1, $dark, 120, 140)
$g.DrawString('ON-CHAIN TICKET  •  0.00015 ETH  •  3000 MAX', $font2, $muted, 125, 245)
$g.DrawString('MINT YOUR LUCK', $font3, $dark, 125, 320)
$g.DrawString('Share this URL in Farcaster to render a Frame', $font4, $muted, 125, 390)

$g.Dispose()

New-Item -ItemType Directory -Force -Path public | Out-Null
$bmp.Save((Join-Path (Get-Location) 'public\\frame.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host 'Wrote public/frame.png'
