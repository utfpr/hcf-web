FROM jacobalberty/firebird:v2.5.9-sc

ENV PATH=$PATH:/usr/local/firebird/bin/

RUN useradd --create-home --shell /bin/bash herbario \
  && apt update \
  && apt upgrade -y \
  && apt install -y \
    libncurses5 \
    python3 \
    python3-pip \
    default-mysql-client \
  && apt clean autoclean -y \
  && rm -rf /var/lib/{apt,dpkg,cache,log} \
  && pip install fdb \
  && pip install mysql-connector-python

WORKDIR /home/herbario

COPY Cidades_Estados_Paises/ conversao.py teste.py updated_herbarios.sql ./ 

RUN chown herbario:herbario conversao.py