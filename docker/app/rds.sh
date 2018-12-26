#!/usr/bin/env bash

mysql -h $NODE_DS -u $NODE_USER -p$NODE_PASS < ./database_schema.sql
