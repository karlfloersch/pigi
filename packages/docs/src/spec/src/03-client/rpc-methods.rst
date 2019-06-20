###########
RPC Methods
###########

***********
Description
***********
We require that the clients interact via `JSON RPC`_. Here we provide a list of available RPC methods that the client **MUST** implement.

-------------------------------------------------------------------------------


*******
Methods
*******

pg_accounts
============

Description
-----------
Returns the list accounts in the client's wallet.

Returns
-------
``string[]``: List of addresses owned by the client.

-------------------------------------------------------------------------------


pg_blockNumber
==============

Description
-----------
Returns the current plasma block number.

Returns
-------
``number``: Current plasma block number.

-------------------------------------------------------------------------------


pg_sign
=======

Description
-----------
Signs a message with the private key of a specified account.

Parameters
----------
1. ``account`` - ``string``: Address of the account to sign with.
2. ``message`` - ``string``: Message to sign.

Returns
-------
``string``: Signature over the given message.

-------------------------------------------------------------------------------


pg_sendRawTransaction
=====================

Description
-----------
Sends a transaction to the client. If the client is not the aggregator, the transaction will be forwarded to the aggregator.

Parameters
----------
1. ``transaction`` - ``string``: Properly `encoded transaction`_ to send to the aggregator.

Returns
-------
``string``: Receipt for the transaction.

-------------------------------------------------------------------------------


pg_sendQuery
============

Description
-----------
Sends a `state query`_ to the client.

Parameters
----------
1. ``query`` - ``StateQuery``: A `StateQuery`_ object.

Returns
-------
``any[]``: Result of the state query. Returns one query result for each `state object`_ that intersected with the range specified in the ``StateQuery``.

-------------------------------------------------------------------------------


pg_getTransactionByHash
=======================

Description
-----------
Returns a full transaction from a transaction hash.

Parameters
----------
1. ``hash`` - ``string``: Hash of the transaction to query.

Returns
-------
``Transaction``: The `Transaction`_ object with the given hash.

-------------------------------------------------------------------------------


pg_getProof
===========

Description
-----------
Returns a `history proof`_ for a given range.

Parameters
----------
1. ``query`` - ``HistoryQuery``: A `HistoryQuery`_ object.

Returns
-------
``HistoryProof``: A `HistoryProof`_ composed of a list of `proof elements`_ that can be ingested.

-------------------------------------------------------------------------------


pg_getInstalledPredicatePlugins
===============================

Description
-----------
Returns the list of predicates installed by the client.

Returns
-------
``string[]``: Address of each predicate for which the client has an installed plugin.

-------------------------------------------------------------------------------


pg_clientVersion
================

Description
-----------
Returns the name and version of the client.

Returns
-------
``string``: Version and name of the client in the form ``<name>/<version>/<os>``.


.. References

.. _`state query`: ./state-queries.html
.. _`StateQuery`: ./state-manager.html#StateQuery
.. _`history proof`: ./history-proofs.html
.. _`proof elements`: ./history-proofs.html#proof-elements
.. _`HistoryQuery`: ./history-generation.html#history-query
.. _`HistoryProof`: ./history-proof-structure.html
.. _`encoded transaction`: ../01-core/state-system.html#id12
.. _`Transaction`: ../01-core/state-system.html#Transaction
.. _`state object`: ../01-core/state-system.html#state-objects
.. _`JSON RPC`: https://www.jsonrpc.org/specification
