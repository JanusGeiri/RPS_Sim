CREATE TABLE RPS_Logs(
    id serial PRIMARY KEY,
    N integer NOT NULL,
    repel double precision NOT NULL,
    attract double precision NOT NULL,
    inter double precision NOT NULL,
    winner integer,
    time_to_win double precision
);

INSERT INTO RPS_Logs(N,repel,attract,inter)
VALUES(
    10,-0.33,1,-1
);