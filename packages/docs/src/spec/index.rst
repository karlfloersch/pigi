=============================================
Plasma Group Generalized Plasma Specification
=============================================
`Plasma Group`_ is working on a `generalized plasma`_ construction that supports significantly more functionality than alternative plasma chains.
Generalized plasma chains are complex objects of study.
This website documents the entirety of the Plasma Group design, from the inner workings of the client to the specifics of the plasma smart contract.

.. toctree::
   :maxdepth: 1
   :caption: #00: Introduction

   src/00-introduction/introduction
   src/00-introduction/glossary
   src/00-introduction/contributors

.. toctree::
   :maxdepth: 1
   :caption: #01: Core Design Components

   src/01-core/state-system
   src/01-core/state-object-ranges
   src/01-core/merkle-interval-tree
   src/01-core/double-layer-tree
   src/01-core/json-rpc

.. toctree::
   :maxdepth: 1
   :caption: #02: Contract Specification
   
   src/02-contracts/contracts-overview
   src/02-contracts/deposit-contract
   src/02-contracts/commitment-contract
   src/02-contracts/predicate-contract
   src/02-contracts/transaction-based-predicate
   src/02-contracts/limbo-exit-predicate

.. toctree::
   :maxdepth: 1
   :caption: #03: Client Specification

   src/03-client/introduction
   src/03-client/deposit-generation
   src/03-client/event-handling
   src/03-client/transaction-generation
   src/03-client/history-proofs
   src/03-client/history-generation
   src/03-client/history-verification
   src/03-client/exit-guarding
   src/03-client/state-queries
   src/03-client/synchronization
   src/03-client/query-expressions
   src/03-client/rpc-methods
   src/03-client/rpc-error-messages

.. toctree::
   :maxdepth: 1
   :caption: #04: Aggregator Specification

   src/04-aggregator/introduction
   src/04-aggregator/transaction-ingestion
   src/04-aggregator/block-generation
   src/04-aggregator/aggregator-rpc-methods
 
.. toctree::
   :maxdepth: 1
   :caption: #05: Client Architecture

   src/05-client-architecture/introduction
   src/05-client-architecture/merkle-interval-tree
   src/05-client-architecture/range-db
   src/05-client-architecture/contract-wrapper
   src/05-client-architecture/event-watcher
   src/05-client-architecture/wallet-db
   src/05-client-architecture/wallet
   src/05-client-architecture/predicate-plugin
   src/05-client-architecture/plugin-manager
   src/05-client-architecture/history-proof-structure
   src/05-client-architecture/history-db
   src/05-client-architecture/history-manager
   src/05-client-architecture/state-db
   src/05-client-architecture/state-manager
   src/05-client-architecture/sync-db
   src/05-client-architecture/sync-manager
   src/05-client-architecture/rpc-client
   src/05-client-architecture/rpc-server

  
.. toctree::
   :maxdepth: 1
   :caption: #06: Aggregator Architecture

   src/06-aggregator-architecture/introduction
   src/06-aggregator-architecture/block-db
   src/06-aggregator-architecture/block-manager
   src/06-aggregator-architecture/aggregator-state-manager

.. toctree::
   :maxdepth: 1
   :caption: #07: Predicate Specifications

   src/07-predicates/introduction
   src/07-predicates/simple-ownership


.. References

.. _`Plasma Group`: https://plasma.group
.. _`generalized plasma`: https://medium.com/plasma-group/plapps-and-predicates-understanding-the-generalized-plasma-architecture-fc171b25741
