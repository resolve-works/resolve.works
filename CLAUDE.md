# Resolve.works - Wagtail Migration

## Overview

Migrating static HTML site to Wagtail CMS. Single-page consulting site with section-based structure ideal for StreamField blocks.

## Current Structure

**Static files (located in project root):**

- `./index.html` - Single page, semantic sections
- `./styles.css` - CSS custom properties, responsive grids
- `./scripts.js` - Analytics consent
- `./images/` - Assets

**Wagtail project:**

- `resolve/` - Django project config
- `home/` - App for homepage
- `manage.py` - Django management

## SEO

Preserve all existing SEO features and implement best practices throughout the migration.
