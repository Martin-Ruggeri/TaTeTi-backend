<a name="top"></a>
# Ta-Te-Ti API

Indice

- [User](#user)
	- [Crear User](#new-user)
	- [Buscar User](#buscar-user)
    - [Buscar User By Token](#buscar-user-token)
    - [Eliminar User](#eliminar-user)
	
- [Game](#game)
	- [Crear Game](#new-game)
	- [Buscar Game](#buscar-game)
	- [Unir User 2 a Game](#unir-user2-game)
	- [Eliminar Game](#eliminar-game)



- [Board](#board)
	- [Crear Board](#new-board)
	- [Buscar Board](#buscar-board)
	- [Seleccionar una casilla](#jugar-casilla)
	- [Eliminar Board](#eliminar-board)

	



# <a name='user'></a> User

## <a name='new-user'></a> Crear User

[Back to top](#top)

<p>Guarda un usuario en la db</p>

	POST /user

### Examples

Body
```
{
  "name" : "nombre del usuario"
}
```

### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "name": name_user,
            "token": token_user,
            "id": id_user
        }
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "Name XXXX already exists" || "empty name"
    }
}
```



## <a name='buscar-user'></a> Buscar User
[Back to top](#top)

<p>Busca un usuario por id.</p>

	GET /user/:id



### Examples


### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "name": name_user,
            "token": token_user,
            "id": id_user
        }
    }
}
```


### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "ERROR findId(), there is no user#id"
    }
}
```




## <a name='buscar-user-token'></a> Buscar User By Token
[Back to top](#top)

<p>Busca un usuario por token.</p>

	GET /user/whoami



### Examples

Header Autorización

```
authorization = token
```

### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "name": name_user,
            "token": token_user,
            "id": id_user
        }
    }
}
```


### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "empty token" || "tocken not found" || other errors
    }
}
```




## <a name='eliminar-user'></a> Eliminar User
[Back to top](#top)

<p>Eliminar User</p>

	GET /user/:id



### Examples

### Success Response
```
{
    "status": "OK",
    "response": {
        "result": "User id delete"
    }
}
```


### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "ERROR there isn't user#id" || "ERROR delete(), error deleting user#id"
    }
}
```



# <a name='game'></a> Game

## <a name='new-game'></a> Crear Game

[Back to top](#top)

<p>Guarda un Game en la db</p>

	POST /game

### Examples
Body

```
{
    "vsMaquina" = true || false    (Opcional, en caso de no estar lo toma como false)
}
```


Header Autorización

```
Authorization = token
```

### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "vsMaquina": true || false,
            "user1": {
                "token": token User,
                "name": name user,
                "id": id User
            },
            ["user2": {
                "id": "9",
                "name": "IA",
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJJQSJ9.HK3J5dHCHSld88YDoapDj5BH4oydGJWJVZDO9POXJmk"
            }] (Si vsMaquina es true se carga el user 2),
            "winUser1": 0,
            "winUser2": 0,
            "id": id game
        }
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "empty token" || "tocken not found" || "ERROR save(), save error game#id"
    }
}
```



## <a name='buscar-game'></a> Buscar Game

[Back to top](#top)

<p>Buscar un Game por id</p>

	GET /game/:id

### Examples
Header Autorización

```
Authorization = token
```
### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "vsMaquina": true || false,
            "user1": {
                "token": token User,
                "name": name user,
                "id": id User
            },
            ["user2": {
               "token": token User,
                "name": name user,
                "id": id User
            }],
            "winUser1": 0,
            "winUser2": 0,
            "id": id game
            ["ultBoard": id board] (al crear un board se carga ultBoard)
        }
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "User doesn't have permissions in this game" || "ERROR findId(), there isn't game#id"
    }
}
```




## <a name='unir-user2-game'></a> Unir User 2 a Game

[Back to top](#top)

<p>Une al segundo jugador al Game</p>

	PUT /game/:id

### Examples
Header Autorización

```
Authorization = token
```
### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "vsMaquina": false,
            "user1": {
                "token": token User,
                "name": name user,
                "id": id User
            },
            ["user2": {
               "token": token User,
                "name": name user,
                "id": id User
            }],
            "winUser1": 0,
            "winUser2": 0,
            "id": id game
        }
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "the Game id already has 2 players" || "empty token" || "tocken not found" || "ERROR edit(), could not modify the Game#id" || other errors
    }
}
```




## <a name='eliminar-game'></a> Eliminar Game

[Back to top](#top)

<p>Eliminar un Game</p>

	DELETE /game/:id

### Examples
Header Autorización

```
Authorization = token
```
### Success Response
```
{
    "status": "OK",
    "response": {
        "result": "Game id delete"
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "User doesn't have permissions in this game" || "ERROR delete(), error deleting Game#id" || other errors
    }
}
```





# <a name='board'></a> Board

## <a name='new-board'></a> Crear Board

[Back to top](#top)

<p>Guarda un Board en la db</p>

	POST /game/:idGame/board

### Examples
Body

```
{
}
```


Header Autorización

```
Authorization = token
```

### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "casillas": [
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0"
            ],
            "turno": token user 1,
            "id": id board
        }
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "User doesn't have permissions in this game" || "ERROR save(), save error board#id" || other errors
    }
}
```



## <a name='buscar-board'></a> Buscar Board

[Back to top](#top)

<p>Buscar un Board por id</p>

	GET /game/:idGame/board/:idBoard

### Examples
Header Autorización

```
Authorization = token
```
### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "id": id board
            "casillas": [
                "0",
                token user 1,
                "0",
                "0",
                "0",
                "0",
                token user 2,
                "0",
                "0"
            ],
            "turno": token user X
            ["win": name user X]
        }
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "User doesn't have permissions in this game" || "ERROR findId(), there isn't board#id" || other errors
    }
}
```




## <a name='jugar-casilla'></a> Seleccionar una casilla

[Back to top](#top)

<p>Seleccionar una casilla del board</p>

	PUT /game/:idGame/board/:idBoard

### Examples
Body

```
{
    "casilla" : numero del 0 al 8
}
```


Header Autorización

```
Authorization = token
```
### Success Response
```
{
    "status": "OK",
    "response": {
        "result": {
            "id": id board
            "casillas": [
                "0",
                token user 1,
                "0",
                "0",
                "0",
                "0",
                token user 2,
                "0",
                "0"
            ],
            "turno": token user X
        }
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "User doesn't have permissions in this game" || "It's not your turn" || "Game over" || "Enter a number" || "Enter valid box [0,1,2,3,4,5,6,7,8]" || "Box already checked" || other errors
    }
}
```




## <a name='eliminar-board'></a> Eliminar Board
[Back to top](#top)

<p>Eliminar un board</p>

	DELETE /game/:idGame/board/:idBoard

### Examples
Header Autorización

```
Authorization = token
```
### Success Response
```
{
    "status": "OK",
    "response": {
        "result": "Board idBoard of game idGame delete"
    }
}
```

### Error Response
```
{
    "status": "ERROR",
    "response": {
        "err": "User doesn't have permissions in this game" || "ERROR delete(), error deleting doard#id" || other errors
    }
}
```