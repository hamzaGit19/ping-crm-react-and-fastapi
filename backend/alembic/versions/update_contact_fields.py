"""update contact fields

Revision ID: update_contact_fields
Revises: 457e3b7cd819
Create Date: 2024-03-19 10:00:00.000000

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "update_contact_fields"
down_revision: Union[str, None] = "457e3b7cd819"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop existing indexes first
    op.execute("DROP INDEX IF EXISTS ix_contacts_name")
    op.execute("DROP INDEX IF EXISTS ix_contacts_first_name")
    op.execute("DROP INDEX IF EXISTS ix_contacts_last_name")
    op.execute("DROP INDEX IF EXISTS ix_contacts_email")

    # Drop the table if it exists
    op.execute("DROP TABLE IF EXISTS contacts")

    # Create new contacts table with updated schema
    op.create_table(
        "contacts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column("address", sa.String(), nullable=False),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("province", sa.String(), nullable=False),
        sa.Column("country", sa.String(), nullable=False),
        sa.Column("postal_code", sa.String(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["company_id"],
            ["companies.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create indexes
    op.create_index(
        op.f("ix_contacts_first_name"), "contacts", ["first_name"], unique=False
    )
    op.create_index(
        op.f("ix_contacts_last_name"), "contacts", ["last_name"], unique=False
    )
    op.create_index(op.f("ix_contacts_email"), "contacts", ["email"], unique=False)


def downgrade() -> None:
    # Drop indexes first
    op.drop_index(op.f("ix_contacts_email"), table_name="contacts")
    op.drop_index(op.f("ix_contacts_last_name"), table_name="contacts")
    op.drop_index(op.f("ix_contacts_first_name"), table_name="contacts")

    # Drop the new contacts table
    op.drop_table("contacts")

    # Recreate the original contacts table
    op.create_table(
        "contacts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column("city", sa.String(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["company_id"],
            ["companies.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_contacts_name"), "contacts", ["name"], unique=False)
