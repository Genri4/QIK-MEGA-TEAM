"""Entrypoint for NATS-based worker."""

import asyncio
import logging

from libs.integrations.nats_controller import run

logging.basicConfig(level=logging.INFO)


def main() -> None:
    asyncio.run(run())


if __name__ == "__main__":
    main()

