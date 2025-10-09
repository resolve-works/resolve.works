from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel

from .blocks import HeroBlock, SectionBlock


class HomePage(Page):
    body = StreamField(
        [
            ("hero", HeroBlock()),
            ("section", SectionBlock()),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]
