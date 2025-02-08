# lib/tasks/sitemap.rake
require 'sitemap_generator'

desc "Generate sitemap"
task generate_sitemap: :environment do
  SitemapGenerator::Sitemap.default_host = 'https://www.format-forge.in'

  SitemapGenerator::Sitemap.create do
    add '/', changefreq: 'daily', priority: 1.0
    add '/image-to-pdf', changefreq: 'weekly', priority: 0.9
    add '/image-signature', changefreq: 'weekly', priority: 0.9
    add '/image-compressor', changefreq: 'weekly', priority: 0.9
    add '/image-text-translator', changefreq: 'weekly', priority: 0.9
    add '/image-svg-converter', changefreq: 'weekly', priority: 0.9
  end
end
