============
Architecture
============
This document describes, in detail, the architecture of ``@pigi/core``.
If you're a new contributor to ``@pigi/core``, welcome!
Hopefully this document will help you better understand how ``@pigi/core`` works under the hood.

@pigi/core 101
===============
``@pigi/core`` is composed of a set of *services* that, when woven together, form (almost) a complete node!
Each of these services performs a very specific role.
A more in-depth explanation of each individual service is available in the *Service API Reference* section of our documentation.

Architecture Diagram
====================
This diagram shows the basic architecture of ``@pigi/core``:

.. figure:: ./_static/images/architecture/architecture.png
    :align: center
    :target: ./_static/images/architecture/architecture.png

    PG Plasma Architecture Diagram

External services
=================
``@pigi/core`` talks to three external services: **Ethereum**, the plasma chain **Aggregator**, and user **applications**.
These three services are *outside* of the scope of ``@pigi/core``.
Instead, ``@pigi/core`` provides interfaces through which it can talk to and hear from these external services.

ContractService
---------------
ContractService_ handles interactions with the plasma chain contract, like submitting deposits or starting withdrawals.
Non-contract specific Ethereum interactions are handled by ETHService_.

ETHService
----------
ETHService_ exposes the functionality necessary to read information from Ethereum.
``ETHService`` is used for non-contract specific interactions.

AggregatorService
---------------
As its name suggests, AggregatorService_ handles all communication with the plasma chain aggregator_.
This includes sending and receiving plasma chain transactions.

JSONRPCService
--------------
The JSONRPCService_ acts as a handler for commands sent by user **applications**.
By default, applications must interact *directly* with ``JSONRPCService``.
``@pigi/core`` can be extended to expose additional interfaces to ``JSONRPCService``, such as an HTTP API.

Internal services
=================
The remaining services of ``@pigi/core`` manage things internally.

SyncService
-----------
Possibly the most important internal service, SyncService_ ensures that your node always has the latest transactions.
``SyncService`` watches Ethereum for any new plasma chain blocks and automatically pulls any necessary information from the Aggregator.
``SyncService`` makes sure your balances are always up-to-date and that you can always send transactions when you need to!

ChainService
------------
ChainService_ is another extremely important internal service.
``ChainService`` manages ``@pigi/core``'s internal blockchain.
This includes storing any necessary transaction and block information.
``ChainService`` also handles returning information about the stored local state with convenient wrapper functions.

GuardService
------------
GuardService_ takes on the important role of keeping your funds safe at all times.
The ``GuardService`` keeps a constant eye on Ethereum and blocks others from trying to move funds without your permission.
``GuardService`` queries Ethereum through the ``ETHService`` and pulls other relevant user data from ``ChainService``.

DBService
---------
DBService_ simply provides a database that ``ChainService`` uses to store user data.
Currently, we support two database backends, LevelDB_ and an in-memory ephemeral database (``EphemDB``).
Most services talk to ``ChainService`` to retrieve data from ``DBService`` instead of talking to ``DBService`` directly.


.. _ContractService: services/contract.html
.. _ETHService: services/eth.html
.. _AggregatorService: services/aggregator.html
.. _aggregator: specs/aggregator.html
.. _JSONRPCSErvice: services/jsonrpc.html
.. _SyncService: services/sync.html
.. _ChainService: services/chain.html
.. _GuardService: services/guard.html
.. _DBService: services/db.html
.. _LevelDB: http://leveldb.org
