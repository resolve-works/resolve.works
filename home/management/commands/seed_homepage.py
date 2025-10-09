from django.core.management.base import BaseCommand
from wagtail.models import Page, Site

from home.models import HomePage


class Command(BaseCommand):
    help = 'Seeds the homepage with initial content from index.html'

    def handle(self, *args, **options):
        # Check if HomePage already exists
        try:
            home_page = HomePage.objects.get(slug='home')
            self.stdout.write(
                self.style.WARNING('HomePage already exists. Updating content...')
            )
        except HomePage.DoesNotExist:
            # Get the root page
            root_page = Page.objects.get(slug='root')

            # Create new HomePage
            home_page = HomePage(
                title='Resolve - AI Consulting for ethical SMBs',
                slug='home',
                seo_title='Resolve - AI Consulting for ethical SMBs | LLM Implementation & Automation',
                search_description='Expert AI consulting services for ethical SMBs. We implement large language models (LLMs) to automate workflows, reduce costs, and amplify human capabilities. Free consultation.',
            )
            root_page.add_child(instance=home_page)
            self.stdout.write(
                self.style.SUCCESS('Created new HomePage')
            )

        # Update SEO fields
        home_page.title = 'Resolve - AI Consulting for ethical SMBs'
        home_page.seo_title = 'Resolve - AI Consulting for ethical SMBs | LLM Implementation & Automation'
        home_page.search_description = 'Expert AI consulting services for ethical SMBs. We implement large language models (LLMs) to automate workflows, reduce costs, and amplify human capabilities. Free consultation.'

        # Set the homepage content
        home_page.body = [
            {
                'type': 'hero',
                'value': {
                    'heading': 'Change your trajectory',
                    'body_text': 'We help ethical SMBs use large language models (LLMs) to save time without replacing people.',
                    'cta_email': 'johan@resolve.works',
                    'cta_phone': '+31 651 952 461',
                }
            }
        ]

        home_page.save()

        # Update the site to use this homepage
        site = Site.objects.filter(is_default_site=True).first()
        if site:
            site.root_page = home_page
            site.save()
            self.stdout.write(
                self.style.SUCCESS(f'Updated site to use HomePage as root')
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully seeded homepage content!')
        )
