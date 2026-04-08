$footer = Get-Content footer_fragment.html -Raw
$wa = Get-Content wa_fragment.html -Raw
$header = Get-Content header_fragment.html -Raw
$files = Get-ChildItem -Filter *.html
foreach ($f in $files) {
    if ($f.Name -ne "footer_fragment.html" -and $f.Name -ne "wa_fragment.html" -and $f.Name -ne "header_fragment.html" -and $f.Name -ne "index-old.html") {
        Write-Host "Updating $($f.Name)..."
        $content = Get-Content $f.FullName -Raw
        
        # Replace Header
        $newContent = [regex]::Replace($content, '(?s)<header.*?>.*?</header>', $header)
        
        # Replace Footer
        $newContent = [regex]::Replace($newContent, '(?s)<footer.*?>.*?</footer>', $footer)
        
        # Replace WhatsApp Button
        $newContent = [regex]::Replace($newContent, '(?s)<a[^>]*class="whatsapp-float".*?>.*?</a>', $wa)
        
        Set-Content -Path $f.FullName -Value $newContent -Encoding UTF8
    }
}
Write-Host "Finished updating all global components."
