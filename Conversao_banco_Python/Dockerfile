FROM jacobalberty/firebird:v2.5.9-sc

RUN useradd --create-home --shell /bin/bash herbario \
  && apt update \
  && apt upgrade -y \
  && apt install libncurses5 python3 python3-pip -y \
  && apt clean autoclean -y \
  && rm -rf /var/lib/{apt,dpkg,cache,log} \
  && pip install fdb

WORKDIR /home/herbario

COPY Cidades_Estados_Paises/ conversao.py teste.py ./

RUN chown herbario:herbario conversao.py
