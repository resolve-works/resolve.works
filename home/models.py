from django.db import models

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail import blocks


class HeroBlock(blocks.StructBlock):
    """Hero block for homepage header."""

    heading = blocks.CharBlock(
        required=True, max_length=255, help_text="Main heading text"
    )

    body_text = blocks.TextBlock(
        required=True, help_text="Body text for the hero section"
    )

    cta_email = blocks.EmailBlock(required=False, help_text="Email address for contact")

    cta_phone = blocks.CharBlock(
        required=False, max_length=50, help_text="Phone number for contact"
    )

    class Meta:
        icon = "placeholder"
        label = "Hero Section"
        template = "blocks/hero_block.html"


class SectionBlock(blocks.StructBlock):
    """Generic section block with title, background, and flexible content."""

    title = blocks.CharBlock(
        required=True, max_length=255, help_text="Section title (h2)"
    )

    background = blocks.ChoiceBlock(
        choices=[
            ("light", "Light"),
            ("dark", "Dark"),
        ],
        default="light",
        help_text="Section background color",
    )

    content = blocks.StreamBlock(
        [
            (
                "paragraph",
                blocks.RichTextBlock(
                    features=["bold", "italic", "link"], help_text="Paragraph of text"
                ),
            ),
        ],
        required=False,
    )

    class Meta:
        icon = "doc-full"
        label = "Section"
        template = "blocks/section_block.html"


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
